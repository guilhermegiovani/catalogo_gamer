import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

// Pegar variavel de ambiente
dotenv.config()

// Conectando com o banco de dados
const db = await mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

export default db