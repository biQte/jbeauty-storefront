export default eventHandler(async (event) => {
  const posts = await queryCollection(event, "blog")
    .where("draft", "<>", false)
    .order("date", "DESC")
    .all();
  return posts;
});
