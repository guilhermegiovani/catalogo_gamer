
import multer from "multer"
import { createGameService, deleteGameService, findGamesByIdService, findGamesReviewBySlugService, findGamesService, updateGameService } from "./gamesService.js"

// const storage = process.env.NODE_ENV === "development" ? multer.diskStorage({
//     destination: "uploads/",
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname)
//     }
// }) : multerter.memoryStorage()

// export const upload = multer({ storage })

export const createGameController = async (req, res) => {
    try {
        const { body } = req
        const files = req.files || {}

        // console.log("BODY:", req.body)
        // console.log("FILES:", req.files)

        let portrait = "https://res.cloudinary.com/dzeuzrko8/image/upload/v1774879523/padrao-portrait_eiltvn.png"
        let landscape = "https://res.cloudinary.com/dzeuzrko8/image/upload/v1774879475/padrao-landscape_n4emxf.png"

        if(files) {
            portrait = files?.["img-portrait"]?.[0]
            landscape = files?.["img-landscape"]?.[0]
        }

        const images = {
            portrait: portrait,
            landscape: landscape
        }

        console.log(images)

        const result = await createGameService(body, images)

        return res.status(201).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const findGamesController = async (req, res) => {
    try {
        const result = await findGamesService(req.query)

        return res.status(201).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const findGamesByIdController = async (req, res) => {
    try {
        const result = await findGamesByIdService(req.params.id)

        return res.status(200).json({ data: result })
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const findGamesReviewBySlugController = async (req, res) => {
    try {
        const result = await findGamesReviewBySlugService(req.params.slug)

        return res.status(200).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const deleteGameController = async (req, res) => {
    try {
        //const result = await deleteGameService(req.params.id)
        await deleteGameService(req.params.id)

        return res.status(200).json({ message: "Game deleted successfully" })
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const updateGameController = async (req, res) => {
    try {
        const results = await updateGameService(req.params.id, req.body, req.files)

        return res.status(200).json({ data: results, message: "Game updated successfully" })
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}