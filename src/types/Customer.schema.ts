import { z } from "zod";

export const CustomerRegisterSchema = z
  .object({
    firstName: z.string().nonempty("Please enter first name!"),
    lastName: z.string().nonempty("Please enter last name!"),
    email: z.email("Invalid email").nonempty("Please enter email!"),
    password: z.string().nonempty("Please enter password!"),
    rePassword: z.string().nonempty("Please confirm password!"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match!",
    path: ["rePassword"],
  });

export type CustomerRegisterType = z.infer<typeof CustomerRegisterSchema>;
