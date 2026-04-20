import { AppError } from "../../utils/AppError.js"
import { findGamesById } from "../games/gamesRepository.js"
import * as repository from "./reviewsRepository.js"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"

dayjs.extend(utc)
dayjs.extend(timezone)

export const createReviewsService = async (body, userId) => {
    const { gameId, note, comment } = body

    if (!gameId || !note) throw new AppError("Missing required fields", 400)
    if (note < 1 || note > 5) throw new AppError("The grade should be between 1 and 5!", 400)

    const checkGameExists = await findGamesById(gameId)
    if (!checkGameExists) throw new AppError("Game not found!", 404)

    const checkUserReviewGameExists = await repository.findReviewUserAndGame(gameId, userId)
    if (checkUserReviewGameExists) throw new AppError("This user already review this game!", 409)


    const reviewId = await repository.createReview(userId, gameId, note, comment || null)
    if (!reviewId) throw new AppError("The review could not be saved!")

    const newReview = await repository.findReviewById(reviewId)

    const format = (dateString) => {
        if (!dateString) return null
        return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    }

    return {
        ...newReview,
        review_date: format(newReview.review_date),
        edit_date: format(newReview.edit_date),
    }
}

export const reactReviewService = async (rId, uId, reaction) => {
    if (!rId) {
        throw new AppError("Review id is required", 400)
    }

    const review = await repository.findReviewById(rId)
    if (!review) throw new AppError("Review not found", 404)

    const existing = await repository.findReactionByReviewAndUser(rId, uId)

    if (!existing) {
        await repository.createReaction(rId, uId, reaction)
    } else {
        await repository.updateReaction(rId, uId, reaction)
    }

    return {
        message: `Review ${reaction} successfully`
    }

}

export const getReviewReactionsSummaryService = async (rId) => {
    const reviewExists = await repository.findReviewById(rId)
    if (!reviewExists) throw new AppError("Review not found!", 404)

    const reactions = await repository.getReviewReactionsSummary(rId)
    if (!reactions) throw new AppError("Error in getting reactions from this review!", 400)

    return reactions
}

export const getUserReactionService = async (reviewId, userId) => {
    const result = await repository.findUserReaction(reviewId, userId)

    if (!result) return null

    return result.reaction
}

export const getGamesAverageRatingsService = async () => {
    const avgGames = await repository.getGamesAverageRatings()

    // if (avgGames.length === 0) throw new AppError("It was not possible to retrieve the average scores for the games!", 404)

    const formattedAvgsGames = avgGames.map(avg => {
        let notaNum = parseFloat(avg.rating)
        if (isNaN(notaNum)) notaNum = 0
        return {
            ...avg,
            rating: Number(notaNum.toFixed(1))
        }
    })

    return formattedAvgsGames
}

export const getGameAverageRatingsByIdService = async (gameId) => {
    const avgCount = await repository.getGameAverageRatingsById(gameId)

    if (avgCount.totReviews === 0) throw new AppError("Game not found!", 404)

    let average = Number(avgCount.avgGrade)

    if (!isNaN(average)) {
        avgCount.avgGrade = Number(average.toFixed(1))
    }

    return avgCount
}

export const findReviewByUserService = async (uId) => {
    const reviewsUser = await repository.findReviewByUser(uId)

    if (reviewsUser.length === 0) throw new AppError("This user hasn't rated any games yet!", 404)

    const format = (dateString) => {
        if (!dateString) return null
        return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    }

    const formattedGames = reviewsUser.map((reviewUser) => ({
        ...reviewUser,
        review_date: format(reviewUser.review_date),
        edit_date: format(reviewUser.edit_date)
    }))

    return formattedGames
}

export const deleteReviewService = async (reviewId, userId) => {
    const reviewExists = await repository.findReviewById(reviewId)
    if (!reviewExists) throw new AppError("Review not found!", 404)

    console.log(`${reviewExists} / ${userId}`)

    if (reviewExists.userId !== userId) throw new AppError("You are not allowed to delete this review!", 403)

    const deletedReview = await repository.deleteReview(reviewId, userId)

    return deletedReview
}

export const updateReviewService = async (reviewId, userId, body) => {
    console.log("SERVICE")
    if (Object.keys(body).length === 0) throw new AppError("None field sent for update", 400)

    const reviewExists = await repository.findReviewById(reviewId)
    if (!reviewExists) throw new AppError("Review not found!", 404)

    console.log(reviewExists.userid + "|" + userId)

    if (reviewExists.userid !== userId) throw new AppError("You are not allowed to update this review!", 403)

    const fieldMap = {
        rating: 'rating',
        comment: 'comment'
    }

    if ('rating' in body) {
        const grade = body.rating

        if (grade < 1 || grade > 5) {
            throw new AppError("The grade have to be between 1 and 5", 400)
        }
    }

    const updatedReview = await repository.updateReview(reviewId, userId, fieldMap, body)

    const format = (dateString) => {
        if (!dateString) return null
        return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    }

    // updatedReview.edit_date = format(updatedReview.edit_date)
    // updatedReview.review_date = format(updatedReview.review_date)

    // return updatedReview
    return {
        ...updatedReview,
        edit_date: format(updatedReview.edit_date)
        // review_date: format(updatedReview.review_date)
    }

}