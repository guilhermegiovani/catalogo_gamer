import { AppError } from "../../utils/AppError.js"
import bcrypt from 'bcryptjs'
import * as repository from "./usersRepository.js"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"
import crypto from "crypto"
import { resend } from "../../utils/resend.js"
import handleUpload from "../../utils/uploadHander.js"

dayjs.extend(utc)
dayjs.extend(timezone)

export const createUserService = async (body) => {
    const { name, email, password } = body

    if (!name || !email || !password) {
        throw new AppError("Please fill in all the fields!", 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const sanitizedEmail = email.trim().toLowerCase()

    if (!regexEmail.test(sanitizedEmail)) {
        throw new AppError("Invalid email!", 400)
    }

    const emailExists = await repository.findUserByEmail(sanitizedEmail)

    if (emailExists && emailExists.length > 0) throw new AppError("Email already exists!", 409)

    await repository.createUser(name, sanitizedEmail, hashedPassword)

    const infoUser = await repository.findUserByEmail(sanitizedEmail)

    const format = (dateString) => {
        if (!dateString) return null
        return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    }

    return {
        ...infoUser,
        created_account: format(infoUser.created_account)
    }

}

export const findUsersService = async () => {
    const users = await repository.findUsers()

    if (users.length === 0) throw new AppError("No user found!", 404)

    return users
}

export const findUserByIdService = async (uId) => {
    const user = await repository.findUserById(uId)

    if (!user) throw new AppError("User not found!", 404)

    const formattedDate = user.map(u => {
        const date = new Date(u.created_account)

        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()

        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        return {
            ...u,
            created_account: `${day}/${month}/${year} ${hours}:${minutes}`
        }

    })

    return formattedDate
}

export const deleteUserService = async (uId) => {
    const userExists = await repository.findUserById(uId)

    if (!userExists) throw new AppError("User not found!", 404)

    const userDeleted = await repository.deleteUser(uId)

    return userDeleted
}

export const forgotPasswordService = async (body) => {
    const { email } = body
    const user = await repository.findUserByEmail(email)

    if (!user) throw new AppError("If there is an account associated with that email address, we will send instructions.", 200)

    const userId = user[0].id
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 1800 * 1000)
    const link = `${process.env.FRONTEND_URL}/resetpassword/${token}`

    try {
        // <p>Ou copie e cole em outra aba do navegador:</p>
        // <p>${link}</p>
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Redefinição de senha",
            html: `
                <p>Você solicitou redefinição de senha.</p>
                <p>Clique no link abaixo para criar uma nova senha.</p>
                <p>Se não abrir automaticamente, segure <strong>Ctrl</strong> e clique no link</p>
                <a href="${link}" target="_blank" rel="noopener noreferrer">Redefinir senha</a>
                <p>O link expira em 30 minutos.</p>
            `
        });
    } catch (err) {
        return res.status(500).json({ erro: "Não foi possível enviar o e-mail" });
    }

    const results = await repository.forgotPassword(token, expires, userId)

    if (!results) throw new AppError("The token could not be generated.", 400)

    return
}

export const resetPasswordService = async (body, token) => {
    const { newPassword, confNewPassword } = body

    const userData = await repository.findUserByToken(token)
    if (!userData) throw new AppError("Token invalid or expired.", 400)

    const userId = userData.id

    const match = await bcrypt.compare(newPassword, userData.password)

    if (match) throw new AppError("The new password must be different from the current one.", 400)

    if (newPassword !== confNewPassword) throw new AppError("The passwords don't match.", 400)

    const passwordCripto = await bcrypt.hash(newPassword, 10)

    const updatePasswordUser = await repository.updatePassword(passwordCripto, userId)

    if (!updatePasswordUser) throw new AppError("It was not possible to update the password.")

    return
}

export const updateUserPasswordService = async (body, uId) => {
    const { currentPassword, newPassword, confNewPassword } = body
    if (!currentPassword || !newPassword || !confNewPassword) throw new AppError("Please fill in all the fields!", 400)

    const userData = await repository.findUserById(uId)

    const match = await bcrypt.compare(currentPassword, userData.password)
    if (!match) throw new AppError("Current password is incorrect!", 400)

    if (newPassword !== confNewPassword) throw new AppError("The new password and the password confirmation must be the same!", 400)

    const matchNewPassword = await bcrypt.compare(newPassword, userData.password)
    if (matchNewPassword) throw new AppError("The new password must be different from the current one!", 400)

    const passwordCripto = await bcrypt.hash(newPassword, 10)

    const results = await repository.updateUserPassword(passwordCripto, uId)

    if (!results) throw new AppError("Invalid credentials", 400)

    return
}

export const updateUserService = async (body, file, uId) => {
    if (file) {
        body.profile_photo = await handleUpload(
            file,
            "users/profilePhoto",
            `user_photo_${userId}`
        )
    }

    if (Object.keys(body).length === 0) throw new AppError("No fields submitted for update!", 400)

    const updatedUser = await repository.updateUser(body, uId)
    if(!updatedUser) throw new AppError("It wasn't possible update user!", 400)

    const getUserData = await repository.findUserById(uId)

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

    return formattedDate
}
