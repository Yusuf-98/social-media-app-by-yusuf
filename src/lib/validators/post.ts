import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const createPostSchema = z.object({
  image: z
    .instanceof(File, { message: "Please select a photo" })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, "Image must be 5MB or smaller")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only PNG, JPG, or WebP images are allowed"
    ),
  caption: z.string().min(1, "Please write a caption"),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
