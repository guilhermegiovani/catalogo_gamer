import { AppError } from "../../utils/AppError.js"
import bcrypt from 'bcryptjs'
import * as repository from "./usersRepository.js"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"
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

    const results = await repository.findUserByEmail(sanitizedEmail)

    if (results && results.length > 0) throw new AppError("Email already exists!", 409)

    await repository.createUser(name, sanitizedEmail, hashedPassword)

    const infoUser = await repository.findUserByEmail(sanitizedEmail)

    // const formattedDate = infoUser.map(user => {
    //     const format = (dateString) => {
    //         if (!dateString) return null
    //         return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    //     }

    //     return {
    //         ...user,
    //         created_account: format(user.created_account)
    //     }

    // })

    // const formatUser = (user) => ({
    //     ...infoUser,
    //     created_account: user.created_account
    //         ? dayjs.utc(user.created_account).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    //         : null
    // })

    const format = (dateString) => {
        if (!dateString) return null
        return dayjs.utc(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
    }

    return {
        ...infoUser,
        created_account: format(infoUser.created_account)
    }

    //return formatUser(user)

}