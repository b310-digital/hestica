export default ({ filter }, { services }) => {
  filter("items.delete", (keys, event, { schema, accountability }) => {
    const { FilesService, ItemsService } = services;
    if (event.collection === "recipes") {
      const itemsService = new ItemsService("recipes", {
        schema: schema,
        accountability: accountability,
      });

      const filesService = new FilesService({
        schema,
        accountability: accountability,
      });

      keys.forEach(async (key: string) => {
        const recipe = await itemsService.readOne(key);
        filesService.deleteOne(recipe.image);
      });
    }
  });
};
