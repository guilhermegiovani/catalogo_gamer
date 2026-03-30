
import multer from "multer"
import { createGameService, deleteGameService, findGamesByIdService, findGamesBySlugService, findGamesService, updateGameService } from "./gamesService.js"

const storage = process.env.NODE_ENV === "development" ? multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
}) : multerter.memoryStorage()

export const upload = multer({ storage })

// upload.fields([
//     { name: "img-portrait", maxCount: 1 },
//     { name: "img-landscape", maxCount: 1 }
// ])

export const createGameController = async (req, res) => {
    try {
        const { body, files } = req

        const portrait = files["img-portrait"]?.[0]
        const landscape = files["img-landscape"]?.[0]

        const images = {
            portrait: portrait,
            landscape: landscape
        }

        const result = await createGameService(body, images)

        return res.status(201).json(result)
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

export const findGamesController = async (req, res) => {
    try {
        const result = await findGamesService(req.query)

        return res.status(201).json(result)
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

export const findGamesByIdController = async (req, res) => {
    try {
        const result = await findGamesByIdService(req.params.id)

        return res.status(200).json({ data: result })
    } catch (err) {
        return res.status(404).json({ error: err.message })
    }
}

export const findGamesBySlugController = async (req, res) => {
    try {
        const result = await findGamesBySlugService(req.params.slug)

        return res.status(200).json({ data: result })
    } catch (err) {
        return res.status(404).json({ error: err.message })
    }
}

export const deleteGameController = async (req, res) => {
    try {
        //const result = await deleteGameService(req.params.id)
        await deleteGameService(req.params.id)

        return res.status(200).json({ message: "Game deleted successfully" })
    } catch (err) {
        return res.status(404).json({ error: err.message })
    }
}

export const updateGameController = async (req, res) => {
    try {
        const results = await updateGameService(req.params.id, req.body)

        return res.status(200).json({ data: results, message: "Game updated successfully" })
    } catch (err) {
        return res.status(404).json({ error: err.message })
    }
}

export const updateImagesGame = async (req, res) => { }