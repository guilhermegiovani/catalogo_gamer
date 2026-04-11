import { getGamesAverageRatingsService, createReviewsService, reactReviewService, updateReviewService, findReviewByUserService, getReviewReactionsSummaryService, deleteReviewService, getGameAverageRatingsByIdService } from "./reviewsService.js"

export const createReviewsControllers = async (req, res) => {
    try {
        const result = await createReviewsService(req.body, req.userId)

        return res.status(201).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const likeReviewController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await reactReviewService(id, req.userId, "like")
        //await repository.countReaction(id, "like")

        return res.status(200).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const dislikeReviewController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await reactReviewService(id, req.userId, "dislike")
        //await repository.countReaction(id, "dislike")

        return res.status(200).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const getReviewReactionsSummaryController = async (req, res) => {
    try {
        const { id } = req.params
        const infoReaction = await getReviewReactionsSummaryService(id)

        return res.status(200).json(infoReaction)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const getGamesAverageRatingsController = async (req, res) => {
    try {
        // const { id } = req.params
        const result = await getGamesAverageRatingsService()

        return res.status(200).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const getGameAverageRatingsByIdController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await getGameAverageRatingsByIdService(id)

        return res.status(200).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const findReviewByUserController = async (req, res) => {
    try {
        // const { id } = req.params
        const result = await findReviewByUserService(req.userId)

        return res.status(200).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const deleteReviewController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteReviewService(id, req.userId)

        return res.status(200).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const updateReviewController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await updateReviewService(id, req.userId, req.body)

        return res.status(200).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}