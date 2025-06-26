import { account } from "@/app/appwrite";
import { ID } from "@/app/appwrite";
import * as z from "zod";
import { AuthenticationSchema } from "../schema/authentication-schema";

export const Login = async (user : z.infer<typeof AuthenticationSchema>) => {
    try {
        const session = await account.createEmailPasswordSession(user?.email, user?.password);
        return session;
    } catch(exception){
        return exception;
    }
}


export const Register = async (user : z.infer<typeof AuthenticationSchema>) => {
    try{
        const login =  await account.create(ID.unique(), user?.email, user.password, user?.name); 
        return login;
    } catch {
        return null;
    }
}

export const Logout = async () => {
    const logout = await account.deleteSession("current");
    return logout;
}