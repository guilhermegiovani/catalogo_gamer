import { isProd } from "../db.js";
import { uploadToCloudinary } from "./cloudinary.js";

async function handleUpload(file, folder, name) {
    if (!file) return null;

    if (!isProd) {
        // Salva caminho local
        return `/uploads/${file.filename}`;
    } else {
        // Envia para Cloudinary
        const result = await uploadToCloudinary(file.buffer, folder, name);
        return result.secure_url;
    }
}

export default handleUpload