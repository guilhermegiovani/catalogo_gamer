import express from 'express'
import {db} from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import { queryDB } from '../utils/dbQuery.js'
import { loginControllers } from '../modules/login/loginControllers.js'

// dotenv.config()

const router = express.Router()
// const jwt_secret = process.env.JWT_SECRET

router.use(express.json())

router.post("/", loginControllers)

export default router