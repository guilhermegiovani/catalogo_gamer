import express from 'express'
import { db } from '../db.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { queryDB } from '../utils/dbQuery.js'

const router = express.Router()

router.use(express.json())
router.use(authMiddleware)

router.post('/', async (req, res) => {
    const { gameId, note, comment } = req.body
    const userId = req.userId

    const checkGameExists = await queryDB("select * from jogos where id = ?;", [gameId])
    if (checkGameExists.length === 0) return res.status(404).json({ erro: "Jogo não encontrado!" })

    const userReviewGame = await queryDB(
        "select * from avaliacoes where usuario_id = ? and jogo_id = ?;",
        [userId, gameId]
    )

    if (userReviewGame.length > 0) return res.status(409).json({ erro: "Usuário já avaliou esse jogo!" })

    if (note < 1 || note > 5) return res.status(400).json({ erro: "A nota deve ser entre 1 e 5!" })

    if (!comment) return res.status(400).json({ erro: "Nenhum comentário foi feito!" })
    // console.log("values" + userId, gameId, note, comment)

    const results = await queryDB(
        "insert into avaliacoes(usuario_id, jogo_id, nota, comentario) values(?, ?, ?, ?);",
        [userId, gameId, note, comment]
    )

    // console.log("res:" + results)

    if (results.length === 0) return res.status(500).json({ erro: "Não foi possível salvar a avaliação!" })

    const createdReview = await queryDB(
        `SELECT a.id, a.nota AS note, a.comentario AS comment, a.jogo_id AS gameId,
            u.id AS userId, u.nome AS userName, a.data_avaliacao as data_avaliacao, a.data_edicao as data_edicao
     FROM avaliacoes a
     JOIN usuarios u ON a.usuario_id = u.id
     WHERE a.id = ?;`,
        [results.insertId]
    )

    return res.status(201).json(createdReview[0])
    // return res.status(201).json({ message: "Avaliação feita com sucesso!", data: createdReview[0] })

})

router.get('/game/:id', async (req, res) => {
    const { id } = req.params

    const results = await queryDB(
        "select a.id, u.id as idUser, u.nome, a.nota, a.comentario, data_avaliacao, data_edicao from avaliacoes as a join usuarios as u on a.usuario_id = u.id where a.jogo_id = ?;",
        [id]
    )

    if (results.length === 0) return res.status(404).json({ erro: "Jogo não encontrado ou não foi avaliado!" })

    const formattedDate = results.map(avaliacao => {
        const format = (dateString) => {
            // console.log(`data rev: ${dateString}`)
            if (!dateString) return null
            const date = new Date(dateString)

            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()

            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')

            return `${day}/${month}/${year} ${hours}:${minutes}`
        }

        return {
            ...avaliacao,
            data_avaliacao: format(avaliacao.data_avaliacao),
            data_edicao: format(avaliacao.data_edicao)
        }

    })

    const resultsAvgCount = await queryDB("select avg(nota) as notaMedia, count(*) as totAvaliacoes from avaliacoes where jogo_id = ?;", [id])

    if (resultsAvgCount[0].totAvaliacoes === 0) return res.status(404).json({ erro: "Jogo não encontrado!" })

    let average = Number(resultsAvgCount[0].notaMedia)

    if (!isNaN(average)) {
        resultsAvgCount[0].notaMedia = Number(average.toFixed(1))
    }

    return res.status(200).json({ avaliacoes: formattedDate, estatisticas: resultsAvgCount[0] })
})

router.get("/averages", async (req, res) => {
    const avgGames = await queryDB(
        "select j.id as gameId, coalesce(avgs.nota, 0) as nota, coalesce(avgs.totAvaliacoes, 0) as totAvaliacoes from jogos j left join (select jogo_id, avg(nota) as nota, count(*) as totAvaliacoes from avaliacoes a group by jogo_id) avgs on j.id = avgs.jogo_id;"
    )

    if (avgGames.length === 0) return res.status(404).json({ error: "Não foi possível pegar as notas médias dos jogos!" })

    const formattedAvgsGames = avgGames.map(avg => {
        let notaNum = parseFloat(avg.nota)
        if (isNaN(notaNum)) notaNum = 0
        avg.nota = Number(notaNum.toFixed(1))
        return avg
    })

    // console.log("Resultado:" + formattedAvgsGames)

    return res.status(200).json(formattedAvgsGames)

})

router.get('/user/:id', async (req, res) => {
    const { id } = req.params

    const results = await queryDB(
        "select a.id, j.titulo, a.nota, a.comentario, data_avaliacao from avaliacoes as a join jogos as j on a.jogo_id = j.id where a.usuario_id = ?;",
        [id]
    )

    if (results.length === 0) return res.status(404).json({ erro: "Este usuário ainda não avaliou nenhum jogo!" })

    const formattedDate = results.map(avaliacao => {
        const date = new Date(avaliacao.data_avaliacao)

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()

        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        return {
            ...avaliacao,
            data_avaliacao: `${day}/${month}/${year} ${hours}:${minutes}`
        }

    })

    return res.status(200).json(formattedDate)

})

router.get('/average/:id', async (req, res) => {
    const { id } = req.params

    const resultsAvgCount = await queryDB("select avg(nota) as notaMedia, count(*) as totAvaliacoes from avaliacoes where jogo_id = ?;", [id])

    if (resultsAvgCount[0].totAvaliacoes === 0) return res.status(404).json({ erro: "Jogo não encontrado!" })

    let average = Number(resultsAvgCount[0].notaMedia)

    if (!isNaN(average)) {
        resultsAvgCount[0].notaMedia = Number(average.toFixed(1))
    }

    return res.status(200).json(resultsAvgCount[0])

})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    const results = await queryDB("delete from avaliacoes where id = ?;", [id])

    if (results.length === 0) return res.status(404).json({ erro: "Avaliação não encontrada!" })

    return res.status(200).json({ message: "Avaliação deletada com sucesso!" })
})

router.patch('/:id', async (req, res) => {
    const { id } = req.params

    if (Object.keys(req.body).length === 0) return res.status(400).json({ erro: "Nenhum campo enviado para atualização" })

    const keysReqBody = []
    const valuesReqBody = []

    const fieldMap = {
        gameId: 'jogo_id',
        nota: 'nota',
        comentario: 'comentario'
    }

    for (const [field, value] of Object.entries(req.body)) {

        if (value !== undefined && value !== '') {
            keysReqBody.push(`${fieldMap[field] || field} = ?`)
            valuesReqBody.push(value)
        }

    }

    if ('nota' in req.body) {
        const note = req.body.nota

        if (note < 1 || note > 5) {
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

    const results = await queryDB(`update avaliacoes set ${fieldsSQL} where id = ?;`, valuesReqBody)

    if (results.length === 0) return res.status(404).json({ erro: "Avaliação não encontrada!" })

    const updateReview = await queryDB(
        `select a.id, a.nota as nota, a.comentario as comentario, a.jogo_id as gameId, a.data_avaliacao, a.data_edicao from avaliacoes as a where a.id = ?;`, [id]
    )

    const format = (dateString) => {
        // console.log(`data edit: ${dateString}`)
        if (!dateString) return null
        const date = new Date(dateString)

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()

        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        return `${day}/${month}/${year} ${hours}:${minutes}`
    }

    updateReview[0].data_edicao = format(updateReview[0].data_edicao)
    updateReview[0].data_avaliacao = format(updateReview[0].data_avaliacao)

    return res.status(200).json(updateReview[0])
    // return res.status(200).json({ message: "Avaliação atualizada com sucesso" })

})

export default router