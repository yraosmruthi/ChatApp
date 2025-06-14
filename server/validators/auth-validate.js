const { z } = require("zod")

const signupSchema = z.object({
  name: z
    .string({ required_error: "name is required" })
    .trim()
    .min(3, { message: "Must have atleast 3 characters" })
    .max(255, { message: "Must have atleast 3 characters" }),

  email: z
  .string({ required_error: "email is required" })
  .trim()
  .email({message:"enter valid email"}),

  password: z
   .string({ required_error: "password is required"})
   .trim()
   .min(4,{message:"Atleast 7 characters"})
   .max(1024,{message:"Maximum of 1024 characters"}),

  
});

const loginSchema = z.object({
   email: z
    .string({ required_error: "email is required" })
    .trim()
    .email({ message: "enter valid email" }),

  password: z
    .string({ required_error: "password is required" })
    .trim()
    .min(4, { message: "Atleast 7 characters" })
    .max(1024, { message: "Maximum of 1024 characters" }),
});

module.exports = {signupSchema,loginSchema}