import express from 'express'
// import db from '../db.js'
import bcrypt from 'bcryptjs'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import multer from "multer"
import { db, isProd } from '../db.js'
import { queryDB } from '../utils/dbQuery.js'
import { uploadToCloudinary } from '../utils/cloudinary.js'
import handleUpload from '../utils/uploadHander.js'
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"
import crypto from "crypto"
import { resend } from '../utils/resend.js'

const router = express.Router()
router.use(express.json())

dayjs.extend(utc)
dayjs.extend(timezone)

router.post('/', async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ erro: "Preencha todos os campos!" })
    }

    const senhaCripto = await bcrypt.hash(password, 10)

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const emailSanitizado = email.trim().toLowerCase()

    if (!regexEmail.test(email)) {
        return res.status(400).json({ erro: "Email inválido" })
    }

    const results = await queryDB("SELECT * FROM users WHERE email = ?;", [email])

    if (results.length > 0) return res.status(409).json({ erro: "Email já existe!" })

    // const resInsert = 
    await queryDB("insert into users(name, email, password) values (?, ?, ?);",
        [name, emailSanitizado, senhaCripto]
    )

    // const newUser = {
    //     name: resInsert.name,
    //     email: resInsert.emailSanitizado,
    //     password: resInsert.password
    // }

    const infoUser = await queryDB("select * from users where email = ?;", [emailSanitizado])

    const formattedDate = infoUser.map(user => {
        const format = (dateString) => {
            if (!dateString) return null
            return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
        }

        return {
            ...user,
            created_account: format(user.created_account)
        }

    })

    // console.log(formattedDate)

    return res.status(201).json({ message: "Usuário criado com sucesso!", newUser: formattedDate })
    // id: newUserId

})

// authMiddleware
router.get('/', async (req, res) => {
    const results = await queryDB("select * from users;")

    if (results.length === 0) return res.status(404).json({ erro: "Nenhum usuário encontrado!" })

    return res.status(200).json(results)

})

router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params

    const results = await queryDB("select * from users where id = ?;", [id])

    if (results.length === 0) return res.status(404).json({ erro: "Nenhum usuário encontrado!" })

    const formattedDate = results.map(user => {
        const date = new Date(user.created_account)

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()

        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        return {
            ...user,
            created_account: `${day}/${month}/${year} ${hours}:${minutes}`
        }

    })

    return res.status(200).json(formattedDate)
})

router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params

    // const results = await queryDB(
    //     isProd
    //     ? "delete from usuarios where id = $1;"
    //     : "delete from usuarios where id = ?;",
    //     [id]
    // )
    const userData = await queryDB("select * from users where id = ?;", [id])
    console.log(userData[0])

    const resDelete = await queryDB("delete from users where id = ?;", [id])
    if (resDelete.length === 0) return res.status(404).json({ erro: "Usuário não encontrado!" })

    return res.status(200).json({ message: "Usuário deletado com sucesso" })

})

router.patch('/newPassword', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword, confNewPassword } = req.body
    const userId = req.userId

    if (!currentPassword || !newPassword || !confNewPassword) {
        console.log("Preencha todos os campos!")
        return res.status(400).json({ erro: "Preencha todos os campos!" })
    }

    const match = await bcrypt.compare(currentPassword, userData[0].password)
    if (!match) {
        console.log("Senha atual incorreta.")
        return res.status(400).json({ erro: "Senha atual incorreta." })
    }

    if (newPassword !== confNewPassword) {
        console.log("Nova senha e a confirmação de senha deve ser iguais")
        return res.status(400).json({ erro: "Nova senha e a confirmação de senha deve ser iguais" })
    }

    const matchNewPassword = await bcrypt.compare(newPassword, userData[0].password)

    if (matchNewPassword) {
        console.log("A nova senha tem que ser diferente da atual")
        return res.status(400).json({ erro: "A nova senha tem que ser diferente da atual" })
    }

    const passwordCripto = await bcrypt.hash(newPassword, 10)

    const results = await queryDB("update users set password = ? where id = ?;", [passwordCripto, userId])

    if (results.length === 0) return res.status(404).json({ erro: "Credenciais inválidas" })

    return res.status(200).json({ message: "Senha atualizado com sucesso" })
})

router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body

    const user = await queryDB("select * from users where email = ?", [email])
    if (!user[0]) {
        return res.status(200).json({ erro: "Se houver uma conta com esse email, enviamos instruções" })
    }

    const userId = user[0].id
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 1800 * 1000)
    const link = `${process.env.FRONTEND_URL}/resetpassword/${token}`

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Redefinição de senha",
            html: `
            <p>Você solicitou redefinição de senha.</p>
            <p>Clique no link abaixo para criar uma nova senha.</p>
            <p>Se não abrir automaticamente, segure <strong>Ctrl</strong> e clique no link ou copie e cole em outra aba do navegador:</p>
            <a href="${link}" target="_blank" rel="noopener noreferrer">Redefinir senha</a>
            <p>O link expira em 30 minutos.</p>
        `
        });
    } catch (err) {
        return res.status(500).json({ erro: "Não foi possível enviar o e-mail" });
    }

    const results = await queryDB(
        "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
        [token, expires, userId]
    )

    if (results.length === 0) return res.status(400).json({ erro: "Não foi possível gerar o token" })

    return res.status(200).json({ message: "Se houver uma conta com esse email, enviamos instruções" })

})

router.post('/resetPassword/:token', async (req, res) => {
    const { token } = req.params
    const { newPassword, confNewPassword } = req.body

    const userData = await queryDB("select * from users where reset_token = ?;", [token])

    if (!userData[0]) {
        return res.status(400).json({ erro: "Token inválido ou expirado." })
    }

    const userId = userData[0].id

    const match = await bcrypt.compare(newPassword, userData[0].password)
    if (match) {
        return res.status(400).json({ erro: "A nova senha tem que ser diferente da atual." })
    }

    if (newPassword !== confNewPassword) {
        return res.status(400).json({ erro: "As senhas não conferem." })
    }

    const passwordCripto = await bcrypt.hash(newPassword, 10)

    // userData = await queryDB(
    //     "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
    //     [passwordCripto, userId]
    // )

    const updateResult = await queryDB(
        "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
        [passwordCripto, userId]
    )

    if (updateResult.length === 0) {
        return res.status(500).json({ erro: "Não foi possível atualizar a senha." })
    }

    return res.status(200).json({ message: "SUCESSO" })

})

const storage = process.env.NODE_ENV === "development" ? multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
}) : multer.memoryStorage()

const upload = multer({ storage })

router.patch('/:id', authMiddleware, upload.single("img-profile"), async (req, res) => {
    const { id } = req.params

    // if (req.file) {
    //     req.body.profile_photo = `/uploads/${req.file.filename}`;
    // }

    // if (req.file) {
    //     const resultsImg = await uploadToCloudinary(req.file.buffer, "users/profilePhoto", `user_photo_${id}`)
    //     req.body.profile_photo = process.env.NODE_ENV === "development"
    //         ? `/uploads/${req.file.filename}`
    //         : resultsImg.secure_url
    // }

    if (req.file) {
        req.body.profile_photo = await handleUpload(
            req.file,
            "users/profilePhoto",
            `user_photo_${id}`
        )
    }

    // console.log(req.body.profile_photo)

    if (Object.keys(req.body).length === 0) return res.status(400).json({ erro: "Nenhum campo enviado para atualização" })

    const keysReqBody = []
    const valuesReqBody = []

    for (const [field, value] of Object.entries(req.body)) {

        if (value !== undefined && value !== '') {
            if (field === 'password') {
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
    const query = `update users set ${fieldsSQL} where id = ?;`

    const results = await queryDB(query, valuesReqBody)
    if (results.length === 0) return res.status(404).json({ erro: "Usuário não encontrado!" })

    // const fieldsNames = Object.keys(req.body).join(", ");
    const getUserData = await queryDB(`select * from users where id = ?`, [id])
    // console.log(JSON.stringify(getUserData))

    const formattedDate = getUserData.map(user => {
        const format = (dateString) => {
            if (!dateString) return null
            return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
        }

        return {
            ...user,
            created_account: format(user.created_account)
        }

    })

    // console.log(formattedDate)

    return res.status(200).json({ message: "Usuário atualizado com sucesso", userData: formattedDate })

})

export default router