import express from 'express'
import {db} from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import { queryDB } from '../utils/dbQuery.js'

dotenv.config()

const router = express.Router()
const jwt_secret = process.env.JWT_SECRET

router.use(express.json())

router.post('/', async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(404).json({ erro: "Preencha todos os campos" })
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!regexEmail.test(email)) {
        return res.status(400).json({ erro: "Email inválido" })
    }

    const results = await queryDB("select id, email, password, role from users where email = ?;", [email])
    if(results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" })

    const match = await bcrypt.compare(password, results[0].password)
    if(match) {
        const token = jwt.sign(
            { id: results[0].id, role: results[0].role },
            jwt_secret,
            { expiresIn: '2h' }
        )

        return res.status(200).json({ message: "Login feito com sucesso", token: token, userId: results[0].id, })
    } else {
        return res.status(401).json({ erro: "Senha incorreta!" })
    }

})

export default router