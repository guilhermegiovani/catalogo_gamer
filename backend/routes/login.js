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
    const {email, senha} = req.body

    if(!email || !senha) {
        return res.status(404).json({ erro: "Preencha todos os campos" })
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!regexEmail.test(email)) {
        return res.status(400).json({ erro: "Email inválido" })
    }

    const results = await queryDB("select id, email, senha, role from usuarios where email = ?;", [email])
    if(results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" })

    const match = await bcrypt.compare(senha, results[0].senha)
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