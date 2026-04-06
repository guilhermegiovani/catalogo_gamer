import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"
import { createReviewsControllers, deleteReviewController, dislikeReviewController, findReviewByUserController, getGameAverageRatingsByIdController, getGamesAverageRatingsController, getReviewReactionsSummaryController, likeReviewController, updateReviewController } from '../modules/reviews/reviewsControllers.js'

const router = express.Router()
dayjs.extend(utc)
dayjs.extend(timezone)

router.use(express.json())
router.use(authMiddleware)

// Fazer uma avaliação do jogo
router.post("/", createReviewsControllers)

// Like reviews
router.post("/:id/like", likeReviewController)

// Dislike reviews
router.post("/:id/dislike", dislikeReviewController)

// Pegar e calcular todas as reações - Refatorar depois
router.get("/:id/reactions", getReviewReactionsSummaryController)

// Pegar reviews do jogo específico

// Pegar jogos que o usuario avaliou
router.get("/user", findReviewByUserController)

// Pegar médias das notas dos jogos
router.get("/averages", getGamesAverageRatingsController)
router.get("/average/:id", getGameAverageRatingsByIdController)

// Deletar review
router.delete("/:id", deleteReviewController)

// Atualizar/editar review
router.patch("/:id", updateReviewController)

export default router