import { Resend } from "resend";
import dotenv from "dotenv"
dotenv.config({ path: envFile })

console.log(`Resend: ${process.env.RESEND_API_KEY}`)

export const resend = new Resend(process.env.RESEND_API_KEY)