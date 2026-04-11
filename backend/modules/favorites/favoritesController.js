import { deleteFavoriteService, favoriteGameService, findFavoritesService } from "./favoritesService.js"

export const favoriteGameController = async (req, res) => {
    try {
        const { gameId } = req.body

        const result = await favoriteGameService(gameId, req.userId)

        return res.status(201).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const findFavoritesController = async (req, res) => {
    try {
        const results = await findFavoritesService(req.userId)

        return res.status(200).json(results)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const deleteFavoriteController = async (req, res) => {
    try {
        const { gameId } = req.body
        await deleteFavoriteService(gameId, req.userId)

        return res.status(200).json({ message: "Game removed from favorites list!" })
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}