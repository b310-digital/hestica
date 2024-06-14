import { defineEndpoint } from "@directus/extensions-sdk";
import Busboy from "busboy";

declare global {
  namespace Express {
    interface Request {
      accountability: Accountability;
    }
  }
}

// Some more background info about BusBoy available here as a reference:
// https://www.netlify.com/blog/2021/07/29/how-to-process-multipart-form-data-with-a-netlify-function/

export default {
  id: "recipe-images",
  handler: defineEndpoint((router, context) => {
    const { services, getSchema } = context;
    const { ItemsService, FilesService } = services;

    router.post("/:recipe_id", async (req, res) => {
      if (!req?.accountability?.user) {
        res.writeHead(401, { Connection: "close" });
        res.end();
        return;
      }

      const itemsService = new ItemsService("recipes", {
        schema: await getSchema(),
        accountability: req.accountability,
      });

      const recipeId = req.params.recipe_id;
      // check access rights by selecting recipe
      const recipe = await itemsService.readOne(recipeId).catch(() => {
        res.writeHead(403, { Connection: "close" });
        res.end();
        return;
      });

      // If the user has access to the recipe, we handle authorization on files ourselfes
      const filesService = new FilesService({
        schema: await getSchema(),
        accountability: null,
      });

      const fileSize = parseInt(process.env.EXTENSION_MAX_PAYLOAD_SIZE || 1, 10) * 1024 * 1024
      const busboy = Busboy({ headers: req.headers, limits: { fileSize } });
      const fields: { [Key: string]: string } = {};
      busboy.on("field", (name: string, value: string) => {
        fields[name] = value;
      });

      busboy.on("file", async (filename, fileStream, { mimeType }) => {
        if (!mimeType.startsWith("image")) {
          res.writeHead(415);
          res.end();
          return;
        }

        // https://github.com/mscdex/busboy/pull/231/files/d0b2f10c74fc9b8ef14aae77c99d09244215eee2
				fileStream.on('limit', () => {
					res.writeHead(413, { 'Connection': 'close' });
					res.end();
					return;
				});

        if (recipe.image) await filesService.deleteOne(recipe.image);

        // set the user on the uploaded item, otherwise it wont be accessible later on
        const data = {
          filename_download: filename,
          title: fields["title"] || "",
          description: fields["description"] || "",
          type: mimeType,
          storage: "local",
          tags: ["recipe"],
          uploaded_by: req?.accountability?.user,
        };

        // These env varaibles do not work here in this extension apparently:
        // FILES_MIME_TYPE_ALLOW_LIST, MAX_PAYLOAD_SIZE
        try {
          const primaryKey = await filesService.uploadOne(fileStream, data);
          const recipe = await itemsService.updateOne(recipeId, {
            image: primaryKey,
          });
          res.json({ recipe });
        } catch (error) {
          res.status(422).json({ error: error });
        }
      });

      busboy.on("error", (error) => {
        res.status(422).json({ error: error });
      });

      req.pipe(busboy);
    });
  }),
};
