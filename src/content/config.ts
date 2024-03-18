import { defineCollection, z } from "astro:content";

const thoughts = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        date: z.date(),
        image: z.optional(z.object({
            url: z.string(),
            alt: z.string(),
        })),
    })
});

export const collections = { thoughts };

