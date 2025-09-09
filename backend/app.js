import express from 'express'
import {db} from './db.js'
import usersRoutes from './routes/users.js'
import loginRoutes from './routes/login.js'
import gamesRoutes from './routes/games.js'
import favoritesRoutes from './routes/favorites.js'
import reviewsRoutes from './routes/reviews.js'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

const server = express()
const port = process.env.PORT || 8000

server.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://catalogo-gamer.vercel.app', // frontend deploy
    'https://catalogo-gamer-ps72y2x9h-guilhermegiovanis-projects.vercel.app',
    'https://catalogo-gamer-git-main-guilhermegiovanis-projects.vercel.app'
  ], // só aceita requisições desse endereço
  credentials: true
}))

server.use(express.json())

// db.connect((err) => {
//     if(err) throw err
//     console.log('Conectado ao Banco!')
// })
console.log("Banco pronto pra usar!")

server.get('/', (req, res) => {
  return res.json({ "message": "JSON Funcionou!" })
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

server.use('/users', usersRoutes)
server.use('/login', loginRoutes)
server.use('/games', gamesRoutes)
server.use('/favorites', favoritesRoutes)
server.use('/reviews', reviewsRoutes)
server.use('/uploads', express.static(path.join(__dirname, 'uploads')))

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})