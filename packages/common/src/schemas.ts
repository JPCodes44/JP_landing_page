import { z } from "zod";

export const ContactFormSchema = z.object({
  email: z.string().email(),
  message: z.string().min(1).max(2000),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;
