import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import pkg from "pg"

// Pegar variavel de ambiente
dotenv.config()
const { Pool } = pkg
const isProd = process.env.NODE_ENV === "production";

let db

// Conectando com o banco de dados
if (isProd) {
    db = new Pool({
        connectionString: process.env.POSTGRES_URL
    })

} else {
    db = await mysql.createPool({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    })

}

export {db, isProd}