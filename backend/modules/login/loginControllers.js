import { loginService } from "./loginService.js"

export const loginControllers = async (req, res) => {
    try {
        const result = await loginService(req.body)

        return res.status(200).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}