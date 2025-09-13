import { isProd } from "../db.js";
import { uploadToCloudinary } from "./cloudinary.js";

async function handleUpload(file, folder, name) {
    try {
        console.log("handleUpload chamado:", { file: file.originalname, folder, name });
        if (!file) return null;

        if (!isProd) {
            // Salva caminho local
            console.log(file.filename)
            return `/uploads/${file.filename}`;
        } else {
            // Envia para Cloudinary
            const result = await uploadToCloudinary(file.buffer, folder, name);
            console.log(`Resultado: ${result.secure_url}`)
            return result.secure_url;
        }
    } catch(err) {
        console.log(`Erro: ${err}`)
        throw err
    }
}

export default handleUpload