import slugify from "slugify"
import { queryDB } from "../../utils/dbQuery.js"
import * as repository from "../reviews/reviewsRepository.js"


export const createGame = async (title, description, genre, platform, studio, slug) => {
    console.log("CRIANDO...")
    const results = await queryDB("insert into games(title, description, genre, platform, studio, slug) values (?, ?, ?, ?, ?, ?)", [title, description, genre, platform, studio, slug]);

    console.log("CRIADO...")
    console.log(results)

    return results[0].id
}

export const findGames = async (limit, offset, search) => {
    const conditionsFilter = []
    const conditionsPagination = []

    const valuesFilter = []
    const valuesPagination = []

    if (search) {
        conditionsFilter.push("LOWER(title) like LOWER(?)")

        valuesFilter.push(`%${search}%`)
    }

    let query = "select * from games"
    if (conditionsFilter.length > 0) {
        query += " WHERE " + conditionsFilter.join(" AND ");
    }

    query += " LIMIT ? OFFSET ?"

    conditionsPagination.push("limit ?", "offset ?")
    valuesPagination.push(limit, offset)

    const games = await queryDB(
        query,
        [...valuesFilter, ...valuesPagination]
    )

    let countQuery = ""
    if (conditionsFilter.length > 0) {
        countQuery = " WHERE " + conditionsFilter[0];
    }

    const count = await queryDB(`select count(*) as total from games ${countQuery}`, valuesFilter)

    const total = count[0].total

    return {
        games,
        total
    }

}

export const findGamesById = async (id) => {
    const game = await queryDB("select * from games where id = ?", [id])

    return game[0]

}

export const findGameByTitle = async (title) => {
    const results = await queryDB("select * from games where title = ?", [title])

    return results[0]
}

export const findGamesReviewBySlug = async (slug) => {
    const game = await queryDB("select * from games where slug = ?", [slug])
    const gameId = game[0].id
    const reviews = await repository.findReviewByGameId(gameId)

    return {
        game: game[0],
        reviews
    }
}

export const deleteGame = async (id) => {
    //const deletedGame = await queryDB("delete from games where id = ?", [id])
    await queryDB("delete from games where id = ?", [id])

    return true
}

export const updateGame = async (id, body) => {
    const conditions = []
    const values = []
    let slug = null

    for (const [key, value] of Object.entries(body)) {
        if (key === "title") {
            slug = slugify(value, { lower: true, strict: true })
        }

        conditions.push(`${key} = ?`)
        values.push(value)
    }

    if (slug) {
        conditions.push("slug = ?")
        values.push(slug)
    }

    values.push(id)

    await queryDB(`update games set ${conditions.join(", ")} WHERE id = ?`, values)

    const updatedGame = await queryDB("select * from games where id = ?", [id])

    return updatedGame[0]

}

export const updateGameImages = async (id, images) => {
    console.log("RECEBIDO NO REPOSITORY:", images)
    const values = [images.img_portrait, images.img_landscape, id]

    const imagesGame = await queryDB("update games set img_portrait = ?, img_landscape = ? WHERE id = ?", values)

    return imagesGame[0]

}