import express from 'express'
import { loginControllers } from '../modules/login/loginControllers.js'

// dotenv.config()

const router = express.Router()
// const jwt_secret = process.env.JWT_SECRET

router.use(express.json())

router.post("/", loginControllers)

export default router