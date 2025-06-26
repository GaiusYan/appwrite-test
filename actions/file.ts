import {storage, account } from "@/app/appwrite";
import {ID} from "appwrite";

const bucketId : string = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID as string;


export const createFile = async (file: File) => {
    try {
        /* console.log("Uploading file to bucket:", bucketId); */
        const session = await account.get();
        console.log({session});
        
        const response = await storage.createFile(
            bucketId,
            ID.unique(),
            file,
            /* [
                Permission.read(session.$id),
                Permission.write(session.$id),
                Permission.update(session.$id),
                Permission.delete(session.$id)
            ] */
        );
        return response;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("File upload failed");
    }
};

export const getFile = async (fileId: string) => {

    try {
        const response = await storage.getFile("unique()", fileId);
        return response;
    } catch (error) {
        console.error("Error fetching file:", error);
        throw new Error("File fetch failed");
    }
};

export const deleteFile = async (fileId: string) => {

    try {
        const response = await storage.deleteFile("unique()", fileId);
        return response;
    } catch (error) {
        console.error("Error deleting file:", error);
        throw new Error("File deletion failed");
    }
}