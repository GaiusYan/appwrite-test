
import * as z from "zod";

export const FileSchema = z
.instanceof(File)
.refine((file) => file.size < 5 * 1024 * 1024, {
    message : "Le fichier doit être inférieur à 5Mo"
})
.refine((file) => ["image/png","image/jpeg","application/pdf"].includes(file.type), {
    message : "Seuls les formats PNG, JPEG et PDF sont acceptés",
})


export const UploadFileSchema = z.object({
    file : FileSchema
})