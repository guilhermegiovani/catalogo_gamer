import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import pkg from "pg"

// Pegar variavel de ambiente
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"
dotenv.config({ path: envFile })

const { Pool } = pkg
const isProd = process.env.NODE_ENV === "production"

// console.log("USER:", process.env.DB_USER)
// console.log("PASSWORD:", process.env.DB_PASSWORD)
// console.log("ENV:", process.env.NODE_ENV)

let db

// Conectando com o banco de dados
if (isProd) {
    db = new Pool({
        connectionString: process.env.POSTGRES_URL
    })

} else {
    db = await mysql.createPool({
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE
    })

}

export {db, isProd}