import express from 'express'
import db from '../db.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import multer from "multer"
import sharp from "sharp"
import path from "path"
import fs from "fs"

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

    const { titulo, descricao, genero, plataforma, estudio } = req.body
    let { imagem_url, imagem_paisagem } = req.body

    if(req.files["img-retrato"]) {
        imagem_url = `/uploads/${req.files["img-retrato"][0].filename}`
    }

    if(req.files["img-paisagem"]) {
        imagem_paisagem = `/uploads/${req.files["img-paisagem"][0].filename}`
    }

    // console.log(`Valores: ${titulo}`)
    // console.log(`Valores: ${descricao}`)
    // console.log(`Valores: ${genero}`)
    // console.log(`Valores: ${plataforma}`)
    // console.log(`Valores: ${estudio}`)
    // console.log(`Valores: ${imagem_url}`)

    if (!titulo || !descricao || !genero || !plataforma || !estudio || (!imagem_url && !req.file) || (!imagem_paisagem && !req.file)) {
        return res.status(400).json({ erro: "Preencha todos os campos" })
    }

    const [results] = await db.query(
        "select * from jogos where titulo = ?;",
        [titulo]
    )

    if (results.length > 0) return res.status(409).json({ erro: "Jogo já existe!" })

    const [resInsert] = await db.query(
        "insert into jogos(titulo, descricao, genero, plataforma, estudio, imagem_url, imagem_paisagem) values(?, ?, ?, ?, ?, ?, ?);",
        [titulo, descricao, genero, plataforma, estudio, imagem_url, imagem_paisagem]
    )

    if (resInsert.affectedRows > 0) {
        return res.status(201).json({ message: "Jogo cadastrado com sucesso!", id: resInsert.insertId })
    }

    return res.status(500).json({ erro: "Erro ao cadastrar jogo" })

})

router.get("/search", async (req, res) => {
    const conditions = []
    const values = []

    for (const [cond, value] of Object.entries(req.query)) {

        if (value !== undefined && value !== '') {

            if (cond === 'titulo') {
                conditions.push('lower(titulo) LIKE lower(?)')
                values.push(`%${value}%`)
            } else {
                conditions.push(`lower(${cond}) = lower(?)`)
                values.push(value)
            }

        }

    }

    const whereSQL = conditions.length > 0 ? `where ${conditions.join(' and ')}` : ''
    const query = `select * from jogos ${whereSQL};`

    console.log('SQL:', query)
    console.log('Values:', values)

    const [results] = await db.query(query, values)
    console.log(results)

    return res.status(200).json(results)

})

router.get("/", async (req, res) => {
    const [results] = await db.query("select * from jogos;")

    if (results.length === 0) return res.status(404).json({ erro: "Nenhum dado encontrado" })

    return res.status(200).json(results)

})

router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params
    const [results] = await db.query(
        "select * from jogos where id = ?;",
        [id]
    )

    if (results.length === 0) return res.status(404).json({ erro: "Nenhum dado encontrado" })

    return res.status(200).json(results[0])

})



// router.delete("/:id", async (req, res) => {
//     const {id} = req.params
//     const [results] = await db.query(
//         "delete from jogos where id = ?;",
//         [id]
//     )

//     if(results.affectedRows === 0) return res.status(404).json({ erro: "Jogo não encontrado!" })

//     return res.status(200).json({ message: "Jogo deletado com sucesso!", id: id })

// })
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params
    console.log("Recebi request pra deletar id:", req.params.id)
    const [results] = await db.query(
        "delete from jogos where id = ?;",
        [id]
    )

    console.log("Resultados do delete:", results)

    if (results.affectedRows === 0) return res.status(404).json({ erro: "Jogo não encontrado!" })
    console.log(`idGame: ${id}`)

    return res.status(200).json({ message: "Jogo deletado com sucesso!", id: id })

})

router.patch("/:id", authMiddleware, adminMiddleware, upload.fields([
    { name: "img-retrato", maxCount: 1 },
    { name: "img-paisagem", maxCount: 1 }
]), async (req, res) => {

    const { id } = req.params

    // console.log("FILES:", req.files) 
    // console.log("BODY:", req.body)

    if(req.files["img-retrato"]) {
        req.body.imagem_url = `/uploads/${req.files["img-retrato"][0].filename}`
    }

    if(req.files["img-paisagem"]) {
        req.body.imagem_paisagem = `/uploads/${req.files["img-paisagem"][0].filename}`
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

    // if(Object.keys(req.body.imagem_url)) {
    //     console.log(`INCLUIDO: ${req.body.imagem_url}`)
    // }

    const fieldsSQL = keysReqBody.join(", ")
    valuesReqBody.push(id)

    // console.log(`Valores: ${valuesReqBody}`)
    // console.log(`Campo: ${fieldsSQL}`)
    if (!fieldsSQL) return res.status(400).json({ erro: "Nenhum campo válido para atualizar!" })

    const [results] = await db.query(`update jogos set ${fieldsSQL} where id = ?;`, valuesReqBody)
    // console.log(`Jogo editado: ${results[0]}`)

    if (results.affectedRows === 0) return res.status(404).json({ erro: "Jogo não encontrado!" })

    return res.status(200).json({ message: "Jogo atualizado com sucesso!", id: id })

})

export default router