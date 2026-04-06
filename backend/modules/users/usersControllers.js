import { createUserService } from "./usersService.js"

export const createUserControllers = async (req, res) => {
    try {
        const result = await createUserService(req.body)

        return res.status(201).json(result)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}