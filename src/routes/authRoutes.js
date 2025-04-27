import express from "express";
import AuthController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

// Rotas públicas
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);

// Rotas protegidas - precisam de autenticação
authRouter.get("/users", authMiddleware, AuthController.getAllUsers);
authRouter.get("/me", authMiddleware, AuthController.getMe);
authRouter.put("/me", authMiddleware, AuthController.updateUser);
authRouter.delete("/me", authMiddleware, AuthController.deleteUser);

export default authRouter;
