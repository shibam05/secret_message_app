import { z } from 'zod'

export const messageSchema = z.object({
    content: z.string()
        .min(8, "content should be atleast 8 characters")
        .max(300, "content should be at most 300 characters")
})