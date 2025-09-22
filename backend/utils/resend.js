import { Resend } from "resend";
import dotenv from "dotenv"

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"
dotenv.config({ path: envFile })

console.log(`Resend: ${process.env.RESEND_API_KEY}`)

export const resend = new Resend(process.env.RESEND_API_KEY)