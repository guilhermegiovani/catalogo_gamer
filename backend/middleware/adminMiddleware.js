export default function(req, res, next) {
    if(req.userRole !== "admin") return res.status(403).json({ erro: "Acesso negado: apenas administradores" })

    next()
}