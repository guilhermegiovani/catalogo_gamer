import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import { AppError } from '../../utils/AppError.js'
import * as repository from "./loginRepository.js"

dotenv.config()
const jwt_secret = process.env.JWT_SECRET

export const loginService = async (body) => {
    const { email, password } = body

    if (!email || !password) {
        throw new AppError("Please fill in all the fields!", 400)
    }

    const sanitizedEmail = email.trim().toLowerCase()

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(sanitizedEmail)) {
        throw new AppError("Invalid email!", 400)
    }

    const user = await repository.loginRepository(sanitizedEmail)

    if (!user) throw new AppError("Invalid credentials", 404)

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw new AppError("Invalid credentials", 401)
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        jwt_secret
        // { expiresIn: '2h' }
    )

    return {
        message: "Login successful.",
        token: token,
        userId: user.id
    }
}