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
        [reaction, rId, uId]
    )

    //return result[0]
    return {
        message: "Reaction updated",
        reaction
    }
}

export const getReviewReactionsSummary = async (rId) => {
    const countReactions = await queryDB(
        "SELECT COUNT(CASE WHEN reaction = 'like' THEN 1 END) AS likes, COUNT(CASE WHEN reaction = 'dislike' THEN 1 END) AS dislikes FROM review_reactions WHERE review_id = ?", [rId]
    )
    // const countReactions = await queryDB(
    //     "SELECT COUNT(*) FILTER(WHERE reaction = 'like') AS likes, COUNT(*) FILTER(WHERE reaction = 'dislike') AS dislikes FROM review_reactions WHERE review_id = ?;", [rId]
    // ) POSTGRES

    return countReactions[0]
}

export const findUserReaction = async (reviewId, userId) => {
    const query = `
        SELECT reaction 
        FROM review_reactions 
        WHERE review_id = ? AND user_id = ?
    `

    const [result] = await queryDB(query, [reviewId, userId])

    return result
}

export const findReactionByReviewAndUser = async (reviewId, userId) => {
    const results = await queryDB("select * from review_reactions where review_id = ? and user_id = ?;", [reviewId, userId])

    return results[0]
}

export const findReviewById = async (reviewId) => {
    const review = await queryDB(
        `SELECT r.id, r.rating, r.comment, r.game_id AS gameId,
            u.id AS userId, u.name, u.nickname AS nickname, r.review_date, r.edit_date
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.id = ?;`,
        [reviewId]
    )

    return review[0]
}

export const findReviewByGameId = async (gameId) => {
    const reviews = await queryDB("select * from reviews where game_id = ?", [gameId])
    // console.log(reviews)
    // console.log(gameId)

    return reviews
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
    const resultsAvgCount = await queryDB("select avg(rating) as avgGrade, count(*) as totReviews from reviews where game_id = ?;", [gameId])

    return resultsAvgCount[0]
}

export const findReviewByUser = async (uId) => {
    const results = await queryDB(
        "select r.id, r.game_id, r.user_id, g.title, r.rating, r.comment, review_date, edit_date from reviews as r join games as g on r.game_id = g.id where r.user_id = ?;",
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
    console.log("REPOSITORY")
    const keysReqBody = []
    const valuesReqBody = []
    console.log(body)

    for (const [field, value] of Object.entries(body)) {
        if(field === "gameId") continue

        if (value !== undefined && value !== '') {
            keysReqBody.push(`${fieldMap[field]} = ?`)
            valuesReqBody.push(value)
        }

    }

    valuesReqBody.push(reviewId, userId)

    const fieldsSQL = keysReqBody.join(", ")

    //console.log(keysReqBody)

    if (keysReqBody.length === 0) {
        throw new AppError("None field valid for update", 400)
    }

    await queryDB(`update reviews set ${fieldsSQL} where id = ? and user_id = ?;`, valuesReqBody)

    const updatedReview = await queryDB(
        `select r.id, r.rating as rating, r.comment as comment, r.game_id as gameId, r.review_date, r.edit_date from reviews as r where r.id = ? and r.user_id = ?;`, [reviewId, userId]
    )

    // `select r.id, r.rating as rating, r.comment as comment, r.game_id as gameId, r.review_date, r.edit_date from reviews as r where r.id = ? and r.user_id = ?;`, [reviewId, userId]

    console.log("SAIU repository")

    return updatedReview[0]
}