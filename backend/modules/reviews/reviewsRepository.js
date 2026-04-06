import { AppError } from "../../utils/AppError.js"
import { queryDB } from "../../utils/dbQuery.js"

export const createReview = async (userId, gameId, note, comment) => {
    const newReview = await queryDB(
        "insert into reviews(user_id, game_id, rating, comment) values(?, ?, ?, ?);",
        [userId, gameId, note, comment]
    )

    return newReview[0].id
}

export const createReaction = async (rId, uId, reaction) => {
    // const newReaction = 
    await queryDB(
        "insert into review_reactions(review_id, user_id, reaction) values(?, ?, ?);",
        [rId, uId, reaction]
    )

    //return newReaction[0]
    return {
        message: "Reaction created",
        reaction
    }
}

export const updateReaction = async (rId, uId, reaction) => {
    await queryDB(
        "update review_reactions set reaction = ? where review_id = ? and user_id = ?;",
        [rId, uId, reaction]
    )

    //return result[0]
    return {
        message: "Reaction updated",
        reaction
    }
}

export const getReviewReactionsSummary = async (rId) => {
    const countReactions = await queryDB(
        "SELECT COUNT(*) FILTER(WHERE reaction = 'like') AS likes, COUNT(*) FILTER(WHERE reaction = 'dislike') AS dislikes FROM review_reactions WHERE review_id = ?;", [rId]
    )

    return countReactions[0]
}

export const findReactionByReviewAndUser = async (reviewId, userId) => {
    const results = await queryDB("select * from review_reactions where review_id = ? and user_id = ?;", [reviewId, userId])

    return results[0]
}

export const findReviewById = async (reviewId) => {
    const createdReview = await queryDB(
        `SELECT r.id, r.rating, r.comment, r.game_id AS gameId,
            u.id AS userId, u.name, u.nickname AS nickname, r.review_date, r.edit_date
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.id = ?;`,
        [reviewId]
    )

    return createdReview[0]
}

export const findReviewUserAndGame = async (gameId, userId) => {
    const userReviewGame = await queryDB("select * from reviews where user_id = ? and game_id = ?;", [userId, gameId])

    return userReviewGame[0]
}

export const getGamesAverageRatings = async () => {
    const avgGames = await queryDB(
        "select g.id as gameId, coalesce(avgs.avgGrade, 0) as rating, coalesce(avgs.totReviews, 0) as totReviews from games g left join (select game_id, avg(rating) as avgGrade, count(*) as totReviews from reviews group by game_id) avgs on g.id = avgs.game_id;"
    )

    return avgGames
}

export const getGameAverageRatingsById = async (gameId) => {
    const resultsAvgCount = await queryDB("select avg(rating) as avgGrade, count(*) as totReviews from reviews where games_id = ?;", [gameId])

    return resultsAvgCount[0]
}

export const findReviewByUser = async (uId) => {
    const results = await queryDB(
        "select r.id, r.game_id, r.user_id, g.title, r.rating, r.comment, review_date from reviews as r join games as g on r.game_id = g.id where r.user_id = ?;",
        [uId]
    )

    return results
}

export const deleteReview = async (reviewId, userId) => {
    await queryDB("delete from reviews where id = ? and user_id = ?;", [reviewId, userId])

    return {
        message: "Review successfully deleted!"
    }
}

export const updateReview = async (reviewId, userId, fieldMap, body) => {
    const keysReqBody = []
    const valuesReqBody = []

    for (const [field, value] of Object.entries(body)) {

        if (value !== undefined && value !== '') {
            keysReqBody.push(`${fieldMap[field]} = ?`)
            valuesReqBody.push(value)
        }

    }

    valuesReqBody.push(reviewId, userId)

    const fieldsSQL = keysReqBody.join(", ")

    if (keysReqBody.length === 0) {
        throw new AppError("None field valid for update", 400)
    }

    await queryDB(`update reviews set ${fieldsSQL} where id = ? and user_id = ?;`, valuesReqBody)

    const updatedReview = await queryDB(
        `select r.id, r.rating as rating, r.comment as comment, r.game_id as gameId, r.review_date, r.edit_date from reviews as r where r.id = ? and r.user_id = ?;`, [reviewId, userId]
    )

    // `select r.id, r.rating as rating, r.comment as comment, r.game_id as gameId, r.review_date, r.edit_date from reviews as r where r.id = ? and r.user_id = ?;`, [reviewId, userId]

    return updatedReview[0]
}