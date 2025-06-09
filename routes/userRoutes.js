// userRoutes.js
import express from "express";
import { UserController } from "../controller/userController.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", UserController.getProfileById);

export default router;