import express from 'express'
import {db, isProd} from './db.js'
import usersRoutes from './routes/users.js'
import loginRoutes from './routes/login.js'
import gamesRoutes from './routes/games.js'
import favoritesRoutes from './routes/favorites.js'
import reviewsRoutes from './routes/reviews.js'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';
// import bcrypt from 'bcryptjs';

// const senha = "12345"; // coloque a senha que você quer
// const hash = await bcrypt.hash(senha, 10);
//$2b$10$WfWKVOjLKN07omPBA4P.FOiNn7sK3SdUupUiqUjCd4ynmJbGe2sde

// console.log(hash);

const server = express()
const port = process.env.PORT || 8000

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://catalogo-gamer.vercel.app",
];

server.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://catalogo-gamer.vercel.app'
  ],
  credentials: true
}));

// server.use(cors({
//   origin: function(origin, callback) {
//     if(!origin) return callback(null, true)
//       if(allowedOrigins.includes(origin)) {
//         return callback(null, true)
//       } else {
//         return callback(new Error("Not allowed by CORS"))
//       }
//   }, // só aceita requisições desse endereço
//   credentials: true
// }))

server.use(express.json())
server.use("/favicon.png", express.static(path.join("caminho/do/frontend", "vite.svg")));

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

if (process.env.NODE_ENV !== "production") {
  server.use("/uploads", express.static(path.join(__dirname, "uploads")));
}

server.get("/check-db", (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    database: isProd ? "Postgres (Neon)" : "MySQL (local)"
  });
});

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})