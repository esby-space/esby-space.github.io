import { defineCollection, z } from "astro:content";

const thoughts = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        date: z.string()
            .or(z.date())
            .transform((value) => new Date(value)),
        image: z.string()
    })
});

export const collections = { thoughts };

