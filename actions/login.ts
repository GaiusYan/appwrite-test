import * as z from "zod";
import { AuthenticationSchema } from "../schema/authentication-schema";

export const Login = async (values :z.infer<typeof AuthenticationSchema>) => {
    const validatedFields = AuthenticationSchema.safeParse(values);

    if(!validatedFields.success) {
        return {
            error: "Champs obligatoire",
        };
    }

    /* await login */
} 