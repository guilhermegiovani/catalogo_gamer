import express, { json } from 'express'
import { db, isProd } from '../db.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { queryDB } from '../utils/dbQuery.js'
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"

const router = express.Router()
dayjs.extend(utc)
dayjs.extend(timezone)

router.use(express.json())
router.use(authMiddleware)

// Fazer uma avaliação do jogo
router.post('/', async (req, res) => {
    const { gameId, note, comment } = req.body
    const userId = req.userId

    const checkGameExists = await queryDB("select * from games where id = ?;", [gameId])
    if (checkGameExists.length === 0) return res.status(404).json({ erro: "Jogo não encontrado!" })

    const userReviewGame = await queryDB(
        "select * from reviews where user_id = ? and game_id = ?;",
        [userId, gameId]
    )

    if (userReviewGame.length > 0) return res.status(409).json({ erro: "Usuário já avaliou esse jogo!" })

    if (note < 1 || note > 5) return res.status(400).json({ erro: "A nota deve ser entre 1 e 5!" })

    if (!comment) return res.status(400).json({ erro: "Nenhum comentário foi feito!" })
    // console.log("values" + userId, gameId, note, comment)

    const results = await queryDB(
        "insert into reviews(user_id, game_id, rating, comment) values(?, ?, ?, ?);",
        [userId, gameId, note, comment]
    )

    console.log("res:" + JSON.stringify(results))

    if (results.length === 0) return res.status(500).json({ erro: "Não foi possível salvar a avaliação!" })

    const createdReview = await queryDB(
        `SELECT r.id, r.rating, r.comment, r.game_id AS gameId,
            u.id AS userId, u.nickname AS nickname, r.review_date, r.edit_date
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.id = ?;`,
        [results.insertId]
    )

    console.log(createdReview[0])

    return res.status(201).json(createdReview[0])
    // return res.status(201).json({ message: "Avaliação feita com sucesso!", data: createdReview[0] })

})

// Like reviews
router.post('/:id/like', async (req, res) => {
    const { id } = req.params
    const userId = req.userId
    const like = "like"

    const results = await queryDB("select * from review_reactions where review_id = ? and user_id = ?;", [id, userId])

    const userLike = !results ? await queryDB("insert into review_reactions(review_id, user_id, reaction) values(?, ?, ?);", [id, userId, like]) : await queryDB("update review_reactions set reaction = ? where review_id = ? and user_id = ?;", [like, id, userId])

    console.log(JSON.stringify(results))
    console.log(JSON.stringify(userLike))

    console.log(`ID review: ${id}`)
    console.log(`ID user: ${userId}`)
})

// Dislike reviews
router.post('/:id/dislike', async (req, res) => {
    const { id } = req.params
    const userId = req.userId
    const dislike = "dislike"

    const results = await queryDB("select * from review_reactions where review_id = ? and user_id = ?;", [id, userId])

    const userDislike = !results ? await queryDB("insert into review_reactions(review_id, user_id, reaction) values(?, ?, ?);", [id, userId, dislike]) : await queryDB("update review_reactions set reaction = ? where review_id = ? and user_id = ?;", [dislike, id, userId])

    console.log(JSON.stringify(results))
    console.log(JSON.stringify(userDislike))

    console.log(`ID review: ${id}`)
    console.log(`ID user: ${userId}`)
})

// Pegar reviews do jogo específico
router.get('/game/:id', async (req, res) => {
    const { id } = req.params

    const results = await queryDB(
        "select r.id, u.id as idUser, u.name, r.rating, r.comment, review_date, edit_date from reviews as r left join users as u on r.user_id = u.id where r.game_id = ?;",
        [id]
    )

    if (results.length === 0) return res.json({ reviews: [] })
    // res.status(404).json({ erro: "Jogo não encontrado ou não foi avaliado!" })

    const formattedDate = results.map(review => {
        const format = (dateString) => {
            // console.log(`data rev: ${dateString}`)
            // if (!dateString) return null
            // const date = new Date(dateString)

            // const day = String(date.getDate()).padStart(2, '0')
            // const month = String(date.getMonth() + 1).padStart(2, '0')
            // const year = date.getFullYear()

            // const hours = String(date.getHours()).padStart(2, '0')
            // const minutes = String(date.getMinutes()).padStart(2, '0')

            // return `${day}/${month}/${year} ${hours}:${minutes}`
            if (!dateString) return null
            return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
        }

        return {
            ...review,
            review_date: format(review.review_date),
            edit_date: format(review.edit_date)
        }

    })

    const resultsAvgCount = await queryDB("select avg(rating) as avgGrade, count(*) as totReviews from reviews where game_id = ?;", [id])

    let statistics = {
        avgGrade: null,
        totReviews: 0
    }

    if (resultsAvgCount.length > 0) {
        let average = Number(resultsAvgCount[0].avgGrade)
        if (!isNaN(average)) {
            statistics.avgGrade = Number(average.toFixed(1))
        }

        statistics.totReviews = resultsAvgCount[0].totReviews
    }

    return res.status(200).json({ reviews: formattedDate, statistics: statistics })
})


// Pegar médias das notas dos jogos
router.get("/averages", async (req, res) => {
    const avgGames = await queryDB(
        "select g.id as gameId, coalesce(avgs.avgGrade, 0) as rating, coalesce(avgs.totReviews, 0) as totReviews from games g left join (select game_id, avg(rating) as avgGrade, count(*) as totReviews from reviews a group by game_id) avgs on g.id = avgs.game_id;"
    )

    if (avgGames.length === 0) return res.status(404).json({ error: "Não foi possível pegar as notas médias dos jogos!" })

    const formattedAvgsGames = avgGames.map(avg => {
        let notaNum = parseFloat(avg.rating)
        if (isNaN(notaNum)) notaNum = 0
        avg.rating = Number(notaNum.toFixed(1))
        return avg
    })

    // console.log("Resultado:" + formattedAvgsGames)

    return res.status(200).json(formattedAvgsGames)

})

// Pegar jogos que o usuario avaliou
router.get('/user/:id', async (req, res) => {
    const { id } = req.params

    const results = await queryDB(
        "select r.id, g.title, r.rating, r.comment, review_date from reviews as r join games as g on r.game_id = g.id where r.user_id = ?;",
        [id]
    )

    if (results.length === 0) return res.status(404).json({ erro: "Este usuário ainda não avaliou nenhum jogo!" })

    const formattedDate = results.map(review => {
        const date = new Date(review.review_date)

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()

        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        return {
            ...review,
            review_date: `${day}/${month}/${year} ${hours}:${minutes}`
        }

    })

    return res.status(200).json(formattedDate)

})

// Pegar média das notas de um jogo
router.get('/average/:id', async (req, res) => {
    const { id } = req.params

    const resultsAvgCount = await queryDB("select avg(rating) as avgGrade, count(*) as totReviews from reviews where games_id = ?;", [id])

    if (resultsAvgCount[0].totReviews === 0) return res.status(404).json({ erro: "Jogo não encontrado!" })

    let average = Number(resultsAvgCount[0].avgGrade)

    if (!isNaN(average)) {
        resultsAvgCount[0].avgGrade = Number(average.toFixed(1))
    }

    return res.status(200).json(resultsAvgCount[0])

})

// Deletar review
router.delete('/:id', async (req, res) => {
    const { id } = req.params

    const results = await queryDB("delete from reviews where id = ?;", [id])

    if (results.length === 0) return res.status(404).json({ erro: "Avaliação não encontrada!" })

    return res.status(200).json({ message: "Avaliação deletada com sucesso!" })
})

// Atualizar/editar review
router.patch('/:id', async (req, res) => {
    const { id } = req.params

    if (Object.keys(req.body).length === 0) return res.status(400).json({ erro: "Nenhum campo enviado para atualização" })

    const keysReqBody = []
    const valuesReqBody = []

    const fieldMap = {
        gameId: 'game_id',
        rating: 'rating',
        comment: 'comment'
    }

    for (const [field, value] of Object.entries(req.body)) {

        if (value !== undefined && value !== '') {
            keysReqBody.push(`${fieldMap[field] || field} = ?`)
            valuesReqBody.push(value)
        }

    }

    if ('rating' in req.body) {
        const grade = req.body.rating

        if (grade < 1 || grade > 5) {
            return res.status(400).json({ erro: "A nota tem que ser entre 1 e 5." })
        }
    }

    valuesReqBody.push(id)

    const fieldsSQL = keysReqBody.join(", ")

    if (keysReqBody.length === 0) {
        return res.status(400).json({ erro: "Nenhum campo válido para atualizar" })
    }

    // console.log('SQL:', `update avaliacoes set ${fieldsSQL} where id = ?;`)
    // console.log('Values:', valuesReqBody)

    const results = await queryDB(`update reviews set ${fieldsSQL} where id = ?;`, valuesReqBody)

    if (results.length === 0) return res.status(404).json({ erro: "Avaliação não encontrada!" })

    const updateReview = await queryDB(
        `select r.id, r.rating as rating, r.comment as comment, r.game_id as gameId, r.review_date, r.edit_date from reviews as r where r.id = ?;`, [id]
    )

    const format = (dateString) => {
        // console.log(`data edit: ${dateString}`)
        // if (!dateString) return null
        // const date = new Date(dateString)

        // const day = String(date.getDate()).padStart(2, '0')
        // const month = String(date.getMonth() + 1).padStart(2, '0')
        // const year = date.getFullYear()

        // const hours = String(date.getHours()).padStart(2, '0')
        // const minutes = String(date.getMinutes()).padStart(2, '0')

        // return `${day}/${month}/${year} ${hours}:${minutes}`
        if (!dateString) return null
        return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    }

    updateReview[0].edit_date = format(updateReview[0].edit_date)
    updateReview[0].review_date = format(updateReview[0].review_date)

    return res.status(200).json(updateReview[0])
    // return res.status(200).json({ message: "Avaliação atualizada com sucesso" })

})

export default router