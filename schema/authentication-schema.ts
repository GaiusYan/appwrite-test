import * as z from "zod";

export const AuthenticationSchema =  z.object({
  email : z.string()
    .min(2, {
      message: "Champs obligatoire",
    })
    .max(50, {
    message : "Champs obligatoire",
  }),
  password : z.string().min(5, {
    message : "Le mot de passe doit être supérieur à 5"
  }),
  name : z.string()
})
