import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export default function(req, res, next) {
    const authHeader = req.headers['authorization'] // Pega o header Authorization

    if(!authHeader) return res.status(401).json({ erro: "Token não fornecido" })

    const token = authHeader.split(' ')[1] // Remove o "Bearer", fica só o token

    if(!token) return res.status(401).json({ erro: "Token inválido" })

    try {
        // Verifica o token e decodifica ele
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Adiciona o id do usuário na requisição (pode usar depois nas rotas)

        req.userId = decoded.id

        // Verificar se é Admin
        req.userRole = decoded.role

        // Continua a execução (vai pra próxima função ou rota)
        next()
    } catch(err) {
        return res.status(401).json({ erro: `Token expirado ou inválido, erro: ${err}` })
    }
}