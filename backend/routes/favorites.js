import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { deleteFavoriteController, favoriteGameController, findFavoritesController } from '../modules/favorites/favoritesController.js'

const router = express.Router()

router.use(express.json())
router.use(authMiddleware)

router.post("/", favoriteGameController)

router.get("/", findFavoritesController)

router.delete("/", deleteFavoriteController)

export default router