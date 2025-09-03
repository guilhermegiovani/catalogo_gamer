import express from 'express'
import db from '../db.js'
import bcrypt from 'bcryptjs'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import multer from "multer"

const router = express.Router()
router.use(express.json())

router.post('/', async (req, res) => {
    const {nome, email, senha} = req.body

    if(!nome || !email || !senha) {
        return res.status(400).json({ erro: "Preencha todos os campos!"} )
    }

    const senhaCripto = await bcrypt.hash(senha, 10)

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const emailSanitizado = email.trim().toLowerCase()

    if(!regexEmail.test(email)) {
        return res.status(400).json({ erro: "Email inválido" })
    }

    const [results] = await db.query("select * from usuarios where email = ?;", [email])
    if(results.length > 0) return res.status(409).json({ erro: "Email já existe!" })

    const [resInsert] = await db.query(
        "insert into usuarios(nome, email, senha) values (?, ?, ?);",
        [nome, emailSanitizado, senhaCripto]
    )

    const newUser = {
        nome: nome,
        email: emailSanitizado,
        senha: senha
    }

    if(resInsert.affectedRows > 0) {
        return res.status(201).json({ message: "Usuário criado com sucesso!", id: resInsert.insertId, newUser: newUser })
    } 

})

// router.get('/', authMiddleware, adminMiddleware, (req, res) => {
//     res.json({ message: 'Você está autenticado!', userId: req.userId, userRole: req.userRole })
// })

router.get('/', authMiddleware, async (req, res) => {
    const [results] = await db.query("select * from usuarios;")

    if(results.length === 0) return res.status(404).json({ erro: "Nenhum usuário encontrado!" })

    return res.status(200).json(results)

})

// router.get('/', async (req, res) => {
//     const [results] = await db.query("select * from usuarios;")

//     if(results.length === 0) return res.status(404).json({ erro: "Nenhum usuário encontrado!" })

//     return res.status(200).json(results)

// })

// router.get('/:id', async (req, res) => {
//     const {id} = req.params

//     const [results] = await db.query("select * from usuarios where id = ?;", [id])

//     if(results.length === 0) return res.status(404).json({ erro: "Nenhum usuário encontrado!" })

//     return res.status(200).json(results[0])

// })
router.get('/:id', authMiddleware, async (req, res) => {
    const {id} = req.params

    const [results] = await db.query("select * from usuarios where id = ?;", [id])

    if(results.length === 0) return res.status(404).json({ erro: "Nenhum usuário encontrado!" })

    return res.status(200).json(results[0])

})

// router.delete('/:id', async (req, res) => {
//     const {id} = req.params

//     const [results] = await db.query("delete from usuarios where id = ?;", [id])

//     if(results.affectedRows === 0) return res.status(404).json({ erro: "Usuário não encontrado!" })

//     return res.status(200).json({ message: "Usuário deletado com sucesso" })

// })
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const {id} = req.params

    const [results] = await db.query("delete from usuarios where id = ?;", [id])

    if(results.affectedRows === 0) return res.status(404).json({ erro: "Usuário não encontrado!" })

    return res.status(200).json({ message: "Usuário deletado com sucesso" })

})

// router.patch('/:id', async (req, res) => {
//     const {id} = req.params

//     if(Object.keys(req.body).length === 0) return res.status(400).json({ erro: "Nenhum campo enviado para atualização" })

//     const keysReqBody = []
//     const valuesReqBody = []

//     for(const [field, value] of Object.entries(req.body)) {

//         if(value !== undefined && value !== '') {
//             if(field === 'senha') {
//                 const senhaCripto = await bcrypt.hash(value, 10)
//                 keysReqBody.push(`${field} = ?`)
//                 valuesReqBody.push(senhaCripto)
//             } else {
//                 keysReqBody.push(`${field} = ?`)
//                 valuesReqBody.push(value)
//             }
    
//         }
//     }

//     valuesReqBody.push(id)
//     const fieldsSQL = keysReqBody.join(", ")

//     const [results] = await db.query(`update usuarios set ${fieldsSQL} where id = ?;`, valuesReqBody)

//     if(results.affectedRows === 0) return res.status(404).json({ erro: "Usuário não encontrado!" })

//     return res.status(200).json({ message: "Usuário atualizado com sucesso" })

// })

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({ storage })

router.patch('/:id', authMiddleware, upload.single("img-jogo"), async (req, res) => {
    const {id} = req.params

    if (req.file) {
        req.body.foto_perfil = `/uploads/${req.file.filename}`;
    }

    if(Object.keys(req.body).length === 0) return res.status(400).json({ erro: "Nenhum campo enviado para atualização" })

    const keysReqBody = []
    const valuesReqBody = []

    for(const [field, value] of Object.entries(req.body)) {

        if(value !== undefined && value !== '') {
            if(field === 'senha') {
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

    const [results] = await db.query(`update usuarios set ${fieldsSQL} where id = ?;`, valuesReqBody)

    if(results.affectedRows === 0) return res.status(404).json({ erro: "Usuário não encontrado!" })

    return res.status(200).json({ message: "Usuário atualizado com sucesso" })

})

export default router