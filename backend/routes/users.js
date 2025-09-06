import express from 'express'
// import db from '../db.js'
import bcrypt from 'bcryptjs'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import multer from "multer"
import { db, isProd } from '../db.js'
import { queryDB } from '../utils/dbQuery.js'

const router = express.Router()
router.use(express.json())

router.post('/', async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Preencha todos os campos!" })
    }

    const senhaCripto = await bcrypt.hash(senha, 10)

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const emailSanitizado = email.trim().toLowerCase()

    if (!regexEmail.test(email)) {
        return res.status(400).json({ erro: "Email inválido" })
    }

    const results = await queryDB("SELECT * FROM usuarios WHERE email = ?;", [email])

    if (results.length > 0) return res.status(409).json({ erro: "Email já existe!" })

    const resInsert = await queryDB("insert into usuarios(nome, email, senha) values (?, ?, ?);",
        [nome, emailSanitizado, senhaCripto]
    )

    const newUser = {
        nome: resInsert.nome,
        email: resInsert.emailSanitizado,
        senha: resInsert.senha
    }

    return res.status(201).json({ message: "Usuário criado com sucesso!", id: newUserId, newUser: newUser })

})

router.get('/', authMiddleware, async (req, res) => {
    const results = await queryDB("select * from usuarios;")

    if (results.length === 0) return res.status(404).json({ erro: "Nenhum usuário encontrado!" })

    return res.status(200).json(results)

})

router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params

    const results = await queryDB("select * from usuarios where id = ?;", [id])

    if (results.length === 0) return res.status(404).json({ erro: "Nenhum usuário encontrado!" })

    return res.status(200).json(results[0])
})

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params

    // const results = await queryDB(
    //     isProd
    //     ? "delete from usuarios where id = $1;"
    //     : "delete from usuarios where id = ?;",
    //     [id]
    // )

    const resDelete = await queryDB("delete from usuarios where id = ?;", [id])
    if (resDelete.length === 0) return res.status(404).json({ erro: "Usuário não encontrado!" })

    return res.status(200).json({ message: "Usuário deletado com sucesso" })

})

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({ storage })

router.patch('/:id', authMiddleware, upload.single("img-jogo"), async (req, res) => {
    const { id } = req.params

    if (req.file) {
        req.body.foto_perfil = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(req.body).length === 0) return res.status(400).json({ erro: "Nenhum campo enviado para atualização" })

    const keysReqBody = []
    const valuesReqBody = []

    for (const [field, value] of Object.entries(req.body)) {

        if (value !== undefined && value !== '') {
            if (field === 'senha') {
                const senhaCripto = await bcrypt.hash(value, 10)
                keysReqBody.push(`${field} = ?`)
                valuesReqBody.push(senhaCripto)
            } else {
                keysReqBody.push(`${field} = ?`)
                valuesReqBody.push(value)
            }

        }
    }

    valuesReqBody.push(id)
    const fieldsSQL = keysReqBody.join(", ")

    // const setClause = keysReqBody.map((field) => `${field} = ?`).join(", ")
    // valuesReqBody.push(id)
    const query = `update usuarios set ${fieldsSQL} where id = ?;`

    results = await queryDB(query, valuesReqBody)
    if (results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado!" })

    return res.status(200).json({ message: "Usuário atualizado com sucesso" })

})

export default router