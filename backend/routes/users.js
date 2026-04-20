import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import multer from "multer"
import { createUserControllers, deleteUserController, findUserByIdController, findUsersController, forgotPasswordController, resetPasswordController, updateUserController, updateUserPasswordController } from '../modules/users/usersControllers.js'

const router = express.Router()
router.use(express.json())

// Create User
// authMiddleware
router.post('/', createUserControllers)

// Find users
router.get("/", authMiddleware, findUsersController)

// Find user by id
router.get("/:id", findUserByIdController)

// Forgot password
router.post("/forgotpassword", forgotPasswordController)

// Reset password
router.post("/resetPassword/:token", resetPasswordController)

// New password
router.patch("/newPassword", authMiddleware, updateUserPasswordController)

const storage = process.env.NODE_ENV === "development" ? multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
}) : multer.memoryStorage()

const upload = multer({ storage })

// Update user
router.patch("/profile/:id", authMiddleware, upload.single("img-profile"), updateUserController)

// Delete user
router.delete("/:id", authMiddleware, deleteUserController)

export default router