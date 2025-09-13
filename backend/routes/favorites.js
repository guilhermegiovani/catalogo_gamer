import express from 'express'
import { db, isProd } from '../db.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { queryDB } from '../utils/dbQuery.js'

const router = express.Router()

router.use(express.json())
router.use(authMiddleware)

router.post('/', async (req, res) => {
    const { gameId } = req.body
    const userId = req.userId

    // console.log(`Game id: ${gameId}`)
    // console.log(`User id: ${userId}`)

    const checkGameId = await queryDB("select * from games where id = ?", [gameId])

    if (checkGameId.length === 0) return res.status(404).json({ erro: "Jogo não existe!" })

    const checkFavoriteUser = await queryDB(
        "select * from favorites where user_id = ? and game_id = ?",
        [userId, gameId]
    )

    if (checkFavoriteUser.length > 0) return res.status(409).json({ erro: "Jogo já está na lista de favoritos!" })

    const results = await queryDB("insert into favorites(user_id, game_id) values(?, ?)", [userId, gameId])
    console.log(results)

    if (results.length === 0) return res.status(500).json({ erro: "Não foi possível adicionar o jogo na lista de favoritos!" })

    return res.status(201).json({
        id: results[0].id,
        user_id: userId,
        game_id: gameId,
        message: "Jogo adicionado aos favoritos!"
    })

})

router.get('/', async (req, res) => {
    const userId = req.userId

    const results = await queryDB(
        "select g.* from favorites f join games g on f.game_id = g.id where f.user_id = ?;",
        [userId]
    )

    if (results.length === 0) return res.status(404).json({ erro: "Usuário não tem jogos favoritados!" })

    return res.status(200).json(results)
})

router.delete('/', async (req, res) => {
    const { gameId } = req.body
    const userId = req.userId

    const results = await queryDB("delete from favorites where user_id = ? and game_id = ?;", [userId, gameId])

    if (results.length === 0) return res.status(404).json({ erro: "Jogo não encontrado na lista de favoritos!" })

    return res.status(200).json({ message: "Jogo retirado da lista de favoritos!" })
})

export default router