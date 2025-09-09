import express from 'express'
import { db, isProd } from '../db.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import multer from "multer"
import sharp from "sharp"
import path from "path"
import fs from "fs"
import { queryDB } from '../utils/dbQuery.js'

const router = express.Router()

router.use(express.json())

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({ storage })

router.post('/', authMiddleware, adminMiddleware, upload.fields([
    { name: "img-retrato", maxCount: 1 },
    { name: "img-paisagem", maxCount: 1 }
]), async (req, res) => {

    const { title, description, genre, platform, studio } = req.body
    let { img_portrait, img_landscape } = req.body

    if (req.files["img-retrato"]) {
        img_portrait = `/uploads/${req.files["img-retrato"][0].filename}`
    }

    if (req.files["img-paisagem"]) {
        img_landscape = `/uploads/${req.files["img-paisagem"][0].filename}`
    }

    // console.log(`Valores: ${titulo}`)
    // console.log(`Valores: ${descricao}`)
    // console.log(`Valores: ${genero}`)
    // console.log(`Valores: ${plataforma}`)
    // console.log(`Valores: ${estudio}`)
    // console.log(`Valores: ${imagem_url}`)

    if (!title || !description || !genre || !platform || !studio || (!img_portrait && !req.file) || (!img_landscape && !req.file)) {
        return res.status(400).json({ erro: "Preencha todos os campos" })
    }

    const results = await queryDB(
        "select * from games where title = ?;",
        [title]
    )

    if (results.length > 0) return res.status(409).json({ erro: "Jogo já existe!" })

    const resInsert = await queryDB(
        "insert into games(title, description, genre, platform, studio, img_portrait, img_landscape) values(?, ?, ?, ?, ?, ?, ?);",
        [title, description, genre, platform, studio, img_portrait, img_landscape]
    )

    if (resInsert.length > 0) {
        return res.status(201).json({ message: "Jogo cadastrado com sucesso!", id: resInsert.insertId })
    }

    return res.status(500).json({ erro: "Erro ao cadastrar jogo", id: newGameId })

})

router.get("/search", async (req, res) => {
    const conditions = []
    const values = []

    for (const [cond, value] of Object.entries(req.query)) {

        if (value !== undefined && value !== '') {

            if (cond === 'title') {
                conditions.push('lower(title) LIKE lower(?)')
                values.push(`%${value}%`)
            } else {
                conditions.push(`lower(${cond}) = lower(?)`)
                values.push(value)
            }

        }

    }

    const whereSQL = conditions.length > 0 ? `where ${conditions.join(' and ')}` : ''
    const query = `select * from games ${whereSQL};`

    // console.log('SQL:', query)
    // console.log('Values:', values)

    const results = await queryDB(query, values)
    // console.log(results)

    return res.status(200).json(results)

})

router.get("/", async (req, res) => {
    const results = await queryDB("select * from games;")

    if (results.length === 0) return res.status(404).json({ erro: "Nenhum dado encontrado" })

    return res.status(200).json(results)

})

router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params

    const results = await queryDB(
        "select * from games where id = ?;",
        [id]
    )

    if (results.length === 0) return res.status(404).json({ erro: "Nenhum dado encontrado" })

    return res.status(200).json(results[0])

})

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params
    // console.log("Recebi request pra deletar id:", req.params.id)
    const results = await queryDB(
        "delete from games where id = ?;",
        [id]
    )

    // console.log("Resultados do delete:", results)

    if (results.length === 0) {
        return res.status(404).json({ erro: "Jogo não encontrado!" })
    }
    // console.log(`idGame: ${id}`)

    return res.status(200).json({ message: "Jogo deletado com sucesso!", id: id })
})

router.patch("/:id", authMiddleware, adminMiddleware, upload.fields([
    { name: "img-retrato", maxCount: 1 },
    { name: "img-paisagem", maxCount: 1 }
]), async (req, res) => {

    const { id } = req.params

    // console.log("FILES:", req.files) 
    // console.log("BODY:", req.body)

    if (req.files["img-retrato"]) {
        req.body.img_portrait = `/uploads/${req.files["img-retrato"][0].filename}`
    }

    if (req.files["img-paisagem"]) {
        req.body.img_landscape = `/uploads/${req.files["img-paisagem"][0].filename}`
    }


    if (Object.keys(req.body).length === 0) return res.status(400).json({ erro: "Nenhum campo enviado para atualização!" })

    const keysReqBody = []
    const valuesReqBody = []

    // const imagem_url = req.file ? `/uploads/${req.file.filename}` : undefined
    // if (imagem_url) req.body.imagem_url = imagem_url

    Object.entries(req.body).forEach(([field, value]) => {
        if (value !== undefined && value !== '') {
            keysReqBody.push(`${field} = ?`)
            valuesReqBody.push(value)
        }
    })

    const fieldsSQL = keysReqBody.join(", ")
    valuesReqBody.push(id)

    // console.log(`Valores: ${valuesReqBody}`)
    // console.log(`Campo: ${fieldsSQL}`)
    if (!fieldsSQL) return res.status(400).json({ erro: "Nenhum campo válido para atualizar!" })

    const results = await queryDB(`update games set ${fieldsSQL} where id = ?;`, valuesReqBody)
    // console.log(`Jogo editado: ${results[0]}`)

    if (results.length === 0) {
        return res.status(404).json({ erro: "Jogo não encontrado!" })
    }

    return res.status(200).json({ message: "Jogo atualizado com sucesso!", id: id })

})

export default router