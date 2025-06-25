"use client";
import { Client, Account } from "appwrite";


export const client = new Client();

const endpoint : string = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;
const project : string = process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string;

if (!endpoint || !project) {
  throw new Error("Appwrite config manquante : vérifier .env.local");
}

client
    .setEndpoint(endpoint)
    .setProject(project);


export const account = new Account(client);
export {ID} from "appwrite";