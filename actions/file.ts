import {storage } from "@/app/appwrite";
import {ID} from "appwrite";

const bucketId : string = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID as string;


export const createFile = async (file: File) => {
    try {
        const response = await storage.createFile(
            bucketId,
            ID.unique(),
            file,
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