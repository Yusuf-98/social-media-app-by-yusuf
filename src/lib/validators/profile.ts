import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(1, "Username is required")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Username can only contain letters, numbers, dots, and underscores"
    ),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
