import { createUserService, deleteUserService, findUserByIdService, findUsersService, forgotPasswordService, resetPasswordService, updateUserPasswordService, updateUserService } from "./usersService.js"

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

export const findUsersController = async (req, res) => {
    try {
        const users = await findUsersService()

        return res.status(200).json(users)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const findUserByIdController = async (req, res) => {
    try {
        const { id } = req.params
        const user = await findUserByIdService(id)

        return res.status(200).json(user)
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params
        await deleteUserService(id)

        return res.status(200).json({ message: "User deleted successfully." })
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        await forgotPasswordService(req.body)

        return res.status(200).json({ message: "If there is an account associated with that email address, we will send instructions." })
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params
        await resetPasswordService(req.body, token)

        return res.status(200).json({ message: "Password updated successfully." })
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const updateUserPasswordController = async (req, res) => {
    try {
        await updateUserPasswordService(req.body, req.userId)

        return res.status(200).json({ message: "Password updated successfully." })
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}

export const updateUserController = async (req, res) => {
    try {
        const user = await updateUserService(req.body, req.file, req.userId)

        return res.status(200).json({ message: "User updated successfully.", data: user })
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message
        })
    }
}