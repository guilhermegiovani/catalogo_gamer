import { AppError } from "../../utils/AppError.js"
import handleUpload from "../../utils/uploadHander.js"
import * as repository from "./gamesRepository.js"
import * as repositoryReviews from "../reviews/reviewsRepository.js"
import slugify from "slugify"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"

dayjs.extend(utc)
dayjs.extend(timezone)

export const createGameService = async (data, files) => {
    const { title, description, genre, platform, studio } = data

    if (!title || !description || !genre || !platform || !studio) {
        throw new Error("Fill in all the fields!", 400)
    }

    const results = await repository.findGameByTitle(title)

    if (results) {
        throw new Error("The game already exists!", 409)
    }

    const slug = slugify(title, { lower: true, strict: true })

    let newGameId

    try {
        newGameId = await repository.createGame(title, description, genre, platform, studio, slug)

        let img_portrait
        let img_landscape

        if (files.portrait) {
            img_portrait = await handleUpload(
                files.portrait,
                "games/portraits",
                `game_portrait_${newGameId}`
            )
        }

        if (files.landscape) {
            img_landscape = await handleUpload(
                files.landscape,
                "games/landscapes",
                `game_landscape_${newGameId}`
            )
        }

        const images = {
            img_portrait,
            img_landscape
        }

        await repository.updateGameImages(newGameId, images)

    } catch (err) {

        console.error("ERRO NO CREATE GAME:", err)
        if (newGameId) {
            await repository.deleteGame(newGameId)
        }
        throw err
    }


    const game = await repository.findGamesById(newGameId)

    const format = (dateString) => {
        if (!dateString) return null
        return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    }

    game.created_at = format(game.created_at)

    return {
        message: "Game successfully registered!",
        id: newGameId
    }

}

export const findGamesService = async (query) => {
    const { page = 1, limit = 10, search } = query

    const pageNumber = Number(page)
    const limitNumber = Number(limit)

    if (Number.isNaN(limitNumber) || limitNumber <= 0 || limitNumber > 9999) {
        throw new AppError("Invalid limit!", 400)
    }

    if (Number.isNaN(pageNumber) || pageNumber <= 0 || pageNumber > 999) {
        throw new Error("Invalid page!", 400)
    }

    const offset = (pageNumber - 1) * limitNumber

    const results = await repository.findGames(limitNumber, offset, search)
    const games = results.games
    const total = results.total

    const format = (dateString) => {
        if (!dateString) return null
        return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    }

    const formattedGames = games.map((game) => ({
        ...game,
        created_at: format(game.created_at),
        updated_at: format(game.updated_at)
    }))

    return {
        formattedGames,
        page: pageNumber,
        limit: limitNumber,
        total
    }
}

export const findGamesByIdService = async (id) => {
    const results = await repository.findGamesById(id)

    if (!results) {
        throw new Error("Game not found!", 404)
    }

    const format = (dateString) => {
        if (!dateString) return null
        return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    }

    return {
        ...results,
        created_at: format(results.created_at),
        updated_at: format(results.updated_at)
    }
}

export const findGamesReviewBySlugService = async (slug) => {
    const { game, reviews } = await repository.findGamesReviewBySlug(slug)

    if (!game) {
        throw new Error("Game not found!", 404)
    }

    const format = (dateString) => {
        if (!dateString) return null
        return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    }

    // const formattedGames = games.map((game) => ({
    //     ...games,
    //     review_date: format(game.review_date),
    //     edit_date: format(game.edit_date)
    // }))


    return {
        reviews,
        game
        // review_date: format(reviews.review_date),
        // edit_date: format(reviews.edit_date)
    }
}

export const deleteGameService = async (id) => {
    const gameExists = await repository.findGamesById(id)
    let gameDeleted

    if (!gameExists) {
        throw new Error("Game not found!", 404)
    } else {
        gameDeleted = await repository.deleteGame(id)
    }

    return gameDeleted
}

export const updateGameService = async (id, body, files) => {
    const gameExists = await repository.findGamesById(id)

    if (!gameExists) {
        throw new Error("Game not found!", 404)
    }

    if (Object.keys(body).length === 0) {
        throw new Error("No fields to update!", 400)
    }

    for (const [key, value] of Object.entries(body)) {
        if (value.trim() === "") {
            throw new Error("One of the fields is empty!", 400)
        }
    }
    console.log(files["img-portrait"])

    const portrait = files["img-portrait"]?.[0]
    const landscape = files["img-landscape"]?.[0]

    let imgPortrait = ""
    let imgLandscape = ""

    if (portrait && portrait.filename) {
        imgPortrait = await handleUpload(
            portrait,
            "games/portraits",
            `game_portrait_${id}`
        )
    }

    if (landscape && landscape.filename) {
        imgLandscape = await handleUpload(
            landscape,
            "games/landscapes",
            `game_landscape_${id}`
        )
    }

    const images = {
        portrait: imgPortrait,
        landscape: imgLandscape
    }

    await repository.updateGameImages(id, images)

    const updatedGame = await repository.updateGame(id, body)

    const format = (dateString) => {
        if (!dateString) return null
        return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    }

    return {
        ...updatedGame,
        created_at: format(updatedGame.created_at),
        updated_at: format(updatedGame.updated_at)
    }
}