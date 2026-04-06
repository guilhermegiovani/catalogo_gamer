import slugify from "slugify"
import { queryDB } from "../../utils/dbQuery.js"


export const createGame = async (title, description, genre, platform, studio, slug) => {
    const results = await queryDB("insert into games(title, description, genre, platform, studio, slug) values (?, ?, ?, ?, ?, ?)", [title, description, genre, platform, studio, slug]);
    
    return results[0].id
}

export const findGames = async (limit, offset, search) => {
    const conditionsFilter = []
    const conditionsPagination = []
    
    const valuesFilter = []
    const valuesPagination = []
    
    if(search) {
        conditionsFilter.push("where title like ?")
        
        valuesFilter.push(`%${search}%`)
    }
    
    conditionsPagination.push("limit ?", "offset ?")
    valuesPagination.push(limit, offset)
    
    const games = await queryDB(
        `select * from games ${conditionsFilter.join(" ")} ${conditionsPagination.join(" ")}`,
        [...valuesFilter, ...valuesPagination]
    )
    
    const count = await queryDB(`select count(*) as total from games ${conditionsFilter.join(" ")}`, valuesFilter)
    
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

export const findGamesBySlug = async (slug) => {
    const game = await queryDB("select * from games where slug = ?", [slug])

    return game[0]

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
        if(key === "title") {
            slug = slugifyy(value, { lower: true, strict: true })
        }

        conditions.push(`${key} = ?`)
        values.push(value)
    }

    if(slug) {
        conditions.push("slug = ?")
        values.push(slug)
    }

    values.push(id)

    await queryDB(`update games set ${conditions.join(", ")} WHERE id = ?`, values)

    const updatedGame = await queryDB("select * from games where id = ?", [id])

    return updatedGame[0]

}

export const updateGameImages = async (id, images) => {
    const values = [images.portrait, images.landscape, id]

    const imagesGame = await queryDB("update games set img_portrait = ?, img_landscape = ? WHERE id = ?", values)

    return imagesGame[0]

}