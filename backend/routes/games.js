import express from 'express'
import { db, isProd } from '../db.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import multer from "multer"
// import sharp from "sharp"
// import path from "path"
// import fs from "fs"
import { queryDB } from '../utils/dbQuery.js'
import { uploadToCloudinary } from '../utils/cloudinary.js'
import handleUpload from '../utils/uploadHander.js'


const router = express.Router()

router.use(express.json())

const storage = process.env.NODE_ENV === "development" ? multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
}) : multer.memoryStorage()
// const storage = multer.memoryStorage()

export const upload = multer({ storage })

// Adicionar novo jogo
router.post('/', authMiddleware, adminMiddleware, upload.fields([
    { name: "img-retrato", maxCount: 1 },
    { name: "img-paisagem", maxCount: 1 }
]), async (req, res) => {

    const { title, description, genre, platform, studio } = req.body
    let { img_portrait, img_landscape } = req.body

    if (!title || !description || !genre || !platform || !studio) {
        return res.status(400).json({ erro: "Preencha todos os campos" })
    }

    const results = await queryDB(
        "select * from games where title = ?;",
        [title]
    )

    if (results.length > 0) return res.status(409).json({ erro: "Jogo já existe!" })

    const resInsert = await queryDB(
        "insert into games(title, description, genre, platform, studio) values(?, ?, ?, ?, ?);",
        [title, description, genre, platform, studio] // img_portrait, img_landscape
    )

    const gameId = resInsert.insertId
    if (!gameId) return res.status(500).json({ erro: "Erro ao cadastrar jogo" });

    // if (req.files["img-retrato"]) {
    //     const resultsImg = await uploadToCloudinary(req.files["img-retrato"][0].buffer, "games/portraits", `game_portrait_${gameId}`)
    //     img_portrait = process.env.NODE_ENV === "development"
    //         ? `/uploads/${req.files["img-retrato"][0].filename}`
    //         : resultsImg.secure_url
    // }

    // if (req.files["img-paisagem"]) {
    //     const resultsImg = await uploadToCloudinary(req.files["img-paisagem"][0].buffer, "games/landscapes", `game_landscape_${gameId}`)
    //     img_landscape = process.env.NODE_ENV === "development"
    //         ? `/uploads/${req.files["img-paisagem"][0].filename}`
    //         : resultsImg.secure_url
    // }

    if (req.files["img-retrato"]) {
        req.body.img_portrait = await handleUpload(
            req.files["img-retrato"][0],
            "games/portraits",
            `game_portrait_${gameId}`
        )
    }

    if (req.files["img-paisagem"]) {
        req.body.img_landscape = await handleUpload(
            req.files["img-paisagem"][0],
            "games/landscapes",
            `games_landscapes_${id}`
        )
    }

    await queryDB(
        "update games set img_portrait = ?, img_landscape = ? where id = ?;",
        [img_portrait, img_landscape, gameId]
    )

    return res.status(201).json({ message: "Jogo cadastrado com sucesso!", id: gameId })

})

// Pesquisar jogo
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

    const results = await queryDB(query, values)

    return res.status(200).json(results)

})

// Pegar todos os jogos
router.get("/", async (req, res) => {
    const results = await queryDB("select * from games;")

    if (results.length === 0) return res.status(404).json({ erro: "Nenhum dado encontrado" })

    return res.status(200).json(results)

})

// Pegar jogo por ID
router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params

    const results = await queryDB(
        "select * from games where id = ?;",
        [id]
    )

    if (results.length === 0) return res.status(404).json({ erro: "Nenhum dado encontrado" })

    return res.status(200).json(results[0])

})

// Deletar Jogo
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params
    // console.log("Recebi request pra deletar id:", req.params.id)
    const results = await queryDB(
        "delete from games where id = ?;",
        [id]
    )

    if (results.length === 0) {
        return res.status(404).json({ erro: "Jogo não encontrado!" })
    }

    return res.status(200).json({ message: "Jogo deletado com sucesso!", id: id })
})

// Atualizar Jogo
router.patch("/:id", authMiddleware, adminMiddleware, upload.fields([
    { name: "img-retrato", maxCount: 1 },
    { name: "img-paisagem", maxCount: 1 }
]), async (req, res) => {

    const { id } = req.params

    // console.log("FILES:", req.files) 
    // console.log("BODY:", req.body)

    // if (req.files["img-retrato"]) {
    //     req.body.img_portrait = `/uploads/${req.files["img-retrato"][0].filename}`
    // }

    // if (req.files["img-paisagem"]) {
    //     req.body.img_landscape = `/uploads/${req.files["img-paisagem"][0].filename}`
    // }

    // if (req.files["img-retrato"]) {
    //     const resultsImg = await uploadToCloudinary(req.files["img-retrato"][0].buffer, "games/portraits", `game_portrait_${id}`)
    //     req.body.img_portrait = process.env.NODE_ENV === "development"
    //         ? `/uploads/${req.files["img-retrato"][0].filename}`
    //         : resultsImg.secure_url
    // }

    // if (req.files["img-paisagem"]) {
    //     const resultsImg = await uploadToCloudinary(req.files["img-paisagem"][0].buffer, "games/landscapes", `game_landscape_${id}`)
    //     req.body.img_landscape = process.env.NODE_ENV === "development"
    //         ? `/uploads/${req.files["img-paisagem"][0].filename}`
    //         : resultsImg.secure_url
    // }

    if (req.files["img-retrato"]) {
        req.body.img_portrait = await handleUpload(
            req.files["img-retrato"][0],
            "games/portraits",
            `game_portrait_${id}`
        )
    }

    console.log(req.body.img_portrait)

    if (req.files["img-paisagem"]) {
        req.body.img_landscape = await handleUpload(
            req.files["img-paisagem"][0],
            "games/landscapes",
            `games_landscapes_${id}`
        )
    }

    console.log(req.body.img_landscape)


    if (Object.keys(req.body).length === 0) return res.status(400).json({ erro: "Nenhum campo enviado para atualização!" })

    const keysReqBody = []
    const valuesReqBody = []

    Object.entries(req.body).forEach(([field, value]) => {
        if (value !== undefined && value !== '') {
            keysReqBody.push(`${field} = ?`)
            valuesReqBody.push(value)
        }
    })

    const fieldsSQL = keysReqBody.join(", ")
    valuesReqBody.push(id)

    if (!fieldsSQL) return res.status(400).json({ erro: "Nenhum campo válido para atualizar!" })

    const results = await queryDB(`update games set ${fieldsSQL} where id = ?;`, valuesReqBody)

    if (results.length === 0) {
        return res.status(404).json({ erro: "Jogo não encontrado!" })
    }

    return res.status(200).json({ message: "Jogo atualizado com sucesso!", id: id })

})

router.get("/db-test", async (req, res) => {
    try {
        const result = await queryDB("SELECT NOW();");
        res.json({ message: "Banco conectado!", now: result });
        console.log("Usando o banco na neon com postgres")
        console.log("NODE_ENV:", process.env.NODE_ENV);
        console.log("Conectando ao DB:", isProd ? "Neon (Postgres)" : "MySQL (dev)");
    } catch (err) {
        console.log("Usando o mysql")
        res.status(500).json({ error: err.message });
    }
});

export default router