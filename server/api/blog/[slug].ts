export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;

  const post = await queryCollection(event, "blog")
    .where("draft", "<>", false)
    .where("handle", "=", slug)
    .first();

  return post;
});
