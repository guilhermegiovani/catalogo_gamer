import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import multer from "multer"
import { queryDB } from '../utils/dbQuery.js'
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"
import { createGameController, deleteGameController, findGamesByIdController, findGamesBySlugController, findGamesController, updateGameController } from '../modules/games/gamesControllers.js'


const router = express.Router()
dayjs.extend(utc)
dayjs.extend(timezone)

router.use(express.json())

const storage = process.env.NODE_ENV === "development" ? multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
}) : multer.memoryStorage()

export const upload = multer({ storage })

// Criar jogo
router.post('/', upload.fields([
    { name: "img-portrait", maxCount: 1 },
    { name: "img-landscape", maxCount: 1 }
]), createGameController)

// Pegar todos os jogos
router.get("/", findGamesController)

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

// Pegar jogo por ID
router.get("/:id", findGamesByIdController)

// Pegar reviews do jogo específico
router.get('/:slug/reviews', findGamesBySlugController)

// Atualizar Jogo
router.patch("/:id", authMiddleware, adminMiddleware, updateGameController)

// Deletar Jogo
router.delete("/:id", authMiddleware, adminMiddleware, deleteGameController)


export default router