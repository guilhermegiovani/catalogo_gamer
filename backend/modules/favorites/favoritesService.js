import * as repository from "./favoriteRepository.js"
import * as repositoryGame from "../games/gamesRepository.js"
import { AppError } from "../../utils/AppError.js"

export const favoriteGameService = async (gameId, userId) => {
    const gameExists = repositoryGame.findGamesById(gameId)
    if (!gameExists) throw new AppError("Game not found!", 404)

    const checkFavoriteUser = await repository.findFavoriteGameByIdGameAndIdUser(gameId, userId)

    if (checkFavoriteUser) throw new AppError("This game is already on your favorites list!", 409)

    const favorite = await repository.favoriteGame(gameId, userId)

    if(!favorite) throw new AppError("We were unable to add the game to our favorites list!")

    return {
        id: favorite.id,
        user_id: userId,
        game_id: gameId,
        message: "Game added to favorites"
    }
}

export const findFavoritesService = async (userId) => {
    const listFavorite = await repository.findFavorite(userId)

    if(listFavorite.length === 0) throw new AppError("The user has no favorite games!", 404)

    return listFavorite
}

export const deleteFavoriteService = async (gameId, userId) => {
    const gameExists = repositoryGame.findGamesById(gameId)
    if (!gameExists) throw new AppError("Game not found!", 404)

    const deletedFavorite = await repository.deleteFavorite(gameId, userId)
    if(!deletedFavorite) throw new AppError("Error removing the game from favorites!")

    return deletedFavorite
}