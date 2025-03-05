import { defineContentConfig, defineCollection, z } from "@nuxt/content";
import { asSitemapCollection } from "@nuxtjs/sitemap/content";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/*.md",
      schema: z.object({
        tags: z.array(z.string()),
        date: z.date(),
        thumbnail: z.string(),
        draft: z.boolean(),
        handle: z.string(),
      }),
    }),
  },
});
