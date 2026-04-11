import { queryDB } from "../../utils/dbQuery.js"

export const favoriteGame = async (gameId, userId) => {
    const favorite = await queryDB("insert into favorites(game_id, user_id) values(?, ?)", [gameId, userId])

    return favorite[0]
}

export const findFavorite = async (userId) => {
    const listFavorite = await queryDB(
        "select g.* from favorites f join games g on f.game_id = g.id where f.user_id = ?;",
        [userId]
    )

    return listFavorite
}

export const findFavoriteGameByIdGameAndIdUser = async (gameId, userId) => {
    const results = await queryDB(
        "select * from favorites where game_id = ? and user_id = ?",
        [gameId, userId]
    )

    return results[0]
}

export const deleteFavorite = async (gameId, userId) => {
    await queryDB("delete from favorites where game_id = ? and user_id = ?;", [gameId, userId])

    return true
}