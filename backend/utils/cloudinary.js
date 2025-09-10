import { v2 as cloudinary } from "cloudinary"
import streamifier from "streamifier"

cloudinary.config({
    secure: true
    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = (buffer, folder, public_id) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder, public_id, overwrite: true },
            (error, result) => {
                if (result) resolve(result)
                else reject(error)
            })

        streamifier.createReadStream(buffer).pipe(stream)
    })

}

export default cloudinary