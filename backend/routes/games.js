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
    { name: "img-portrait", maxCount: 1 },
    { name: "img-landscape", maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, description, genre, platform, studio } = req.body
        // let { img_portrait, img_landscape } = req.body
        let img_portrait
        let img_landscape

        if (!title || !description || !genre || !platform || !studio) {
            return res.status(400).json({ erro: "Preencha todos os campos" })
        }

        console.log("REQ_BODY:", req.body);
        console.log("REQ_FILES:", req.files);

        const results = await queryDB(
            "select * from games where title = ?;",
            [title]
        )

        console.log("PAROU AQUI 1")

        if (results.length > 0) return res.status(409).json({ erro: "Jogo já existe!" })

        console.log("PAROU AQUI 2")

        const resInsert = await queryDB(
            "insert into games(title, description, genre, platform, studio) values(?, ?, ?, ?, ?);",
            [title, description, genre, platform, studio] // img_portrait, img_landscape
        )

        console.log(`Game: ${JSON.stringify(resInsert[0])}`)

        const gameId = resInsert.insertId

        console.log("ID game: " + gameId)
        console.log("ID game: " + resInsert.insertId)
        
        if (!gameId) return res.status(500).json({ erro: "Erro ao cadastrar jogo" });

        console.log("PAROU AQUI 3")

        if (req.files["img-portrait"]) {
            try {
                img_portrait = await handleUpload(
                    req.files["img-portrait"][0],
                    "games/portraits",
                    `game_portrait_${gameId}`
                )

                console.log(`URL Retrato: ${img_portrait}`)
            } catch(err) {
                console.log(`Error: ${err}`)
                return res.status(500).json({ erro: "Falha ao enviar imagem retrato", detalhe: err.message })
            }

        }

        console.log("PAROU AQUI 4")

        if (req.files["img-landscape"]) {
            try {
                img_landscape = await handleUpload(
                    req.files["img-landscape"][0],
                    "games/landscapes",
                    `games_landscape_${gameId}`
                )

                console.log(`URL Paisagem: ${img_landscape}`)
            } catch(err) {
                console.log(`Error: ${err}`)
                return res.status(500).json({ erro: "Falha ao enviar imagem retrato", detalhe: err.message })
            }
        }

        console.log("PAROU AQUI 5")
        console.log(`IMG-RETRATO: ${img_portrait}`)
        console.log(`IMG-PAISAGEM: ${img_landscape}`)

        const updates = [];
        const values = [];

        if (img_portrait) {
            updates.push("img_portrait = ?");
            values.push(img_portrait);
        }

        if (img_landscape) {
            updates.push("img_landscape = ?");
            values.push(img_landscape);
        }

        if (updates.length > 0) {
            values.push(gameId);
            await queryDB(`UPDATE games SET ${updates.join(", ")} WHERE id = ?;`, values);
        }

        // if (img_portrait || img_landscape) {
        //     await queryDB(
        //         "update games set img_portrait = ?, img_landscape = ? where id = ?;",
        //         [img_portrait, img_landscape, gameId]
        //     )
        // }

        console.log(`IMG-RETRATO: ${img_portrait}`)
        console.log(`IMG-PAISAGEM: ${img_landscape}`)

        return res.status(201).json({ message: "Jogo cadastrado com sucesso!", id: gameId })
    } catch (err) {
        console.error("Erro no POST /games:", err);
        return res.status(500).json({ erro: err.message });
    }


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
    const results = await queryDB("SELECT * FROM games ORDER BY id ASC;")

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
    { name: "img-portrait", maxCount: 1 },
    { name: "img-landscape", maxCount: 1 }
]), async (req, res) => {

    const { id } = req.params
    let img_portrait, img_landscape

    // console.log("FILES:", req.files)
    // console.log("BODY:", req.body)

    if (req.files["img-portrait"]) {
        img_portrait = await handleUpload(
            req.files["img-portrait"][0],
            "games/portraits",
            `game_portrait_${id}`
        )
    }

    if (req.files["img-landscape"]) {
        img_landscape = await handleUpload(
            req.files["img-landscape"][0],
            "games/landscapes",
            `games_landscape_${id}`
        )
    }

    if (img_portrait) req.body.img_portrait = img_portrait
    if (img_landscape) req.body.img_landscape = img_landscape

    // console.log("FILES:", req.files)
    // console.log("BODY:", req.body)
    // console.log("Portrait:", req.body.img_portrait)
    // console.log("Landscape:", req.body.img_landscape)

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

// router.get("/db-test", async (req, res) => {
//     try {
//         const result = await queryDB("SELECT NOW();");
//         res.json({ message: "Banco conectado!", now: result });
//         console.log("Usando o banco na neon com postgres")
//         console.log("NODE_ENV:", process.env.NODE_ENV);
//         console.log("Conectando ao DB:", isProd ? "Neon (Postgres)" : "MySQL (dev)");
//     } catch (err) {
//         console.log("Usando o mysql")
//         res.status(500).json({ error: err.message });
//     }
// });

export default router