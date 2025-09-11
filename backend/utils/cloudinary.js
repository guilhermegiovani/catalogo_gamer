import { v2 as cloudinary } from "cloudinary"
import streamifier from "streamifier"

cloudinary.config({
    secure: true
})


export const uploadToCloudinary = async (buffer, folder, public_id) => {
    try{
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder, public_id, overwrite: true },
                (error, result) => {
                    if (result) resolve(result)
                    else reject(error)
                })
    
            streamifier.createReadStream(buffer).pipe(stream)
        })
    } catch(err) {
        console.log(`Erro ao adicionar imagem: ${err}`)
        throw err
    }

}

// export const destroyCloudinary = async (public_id) => {
//     try {
//         const result = await cloudinary.uploader.destroy(public_id)
//         console.log("Imagem removida:", result)
//         return result
//     } catch(err) {
//         console.error("Erro ao remover imagem:", err)
//         throw err
//     }
// }

export default cloudinary