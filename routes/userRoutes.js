// userRoutes.js
import express from "express";
import { UserController } from "../controller/userController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile", authenticateToken, UserController.getProfile);

export default router;