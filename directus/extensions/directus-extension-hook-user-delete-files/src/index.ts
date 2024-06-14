// Needs hook to pass or delete all images before
// https://github.com/directus/directus/issues/9507
export default ({ filter }, { services }) => {
  filter("users.delete", (keys, _event, { schema, accountability }) => {
    const { FilesService, UsersService } = services;

    const itemsService = new UsersService({
      schema: schema,
      accountability: accountability,
    });

    const filesService = new FilesService({
      schema,
      accountability: accountability,
    });

    keys.forEach(async (key: string) => {
      // Check if user has permissions to read user object
      const user = await itemsService.readOne(key);
      await filesService.deleteByQuery({ filter: { uploaded_by: user.id } }, { emitEvents: false });
    });
  });
};
