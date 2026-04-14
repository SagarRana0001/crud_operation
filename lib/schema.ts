import { z } from "zod";
export const userSchema = z.object({
  name: z.string().min(3, "Name must be a 3 Chars"),
  email: z.string().email("Invalid Email"),
});
