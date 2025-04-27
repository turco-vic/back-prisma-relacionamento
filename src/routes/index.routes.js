import express from "express";
import authRouter from "./authRoutes.js";
import animesRouter from "./animeRoutes.js";
import personagensRouter from "./personagemRoutes.js";
import collectionRouter from "./collectionRoutes.js";
import cardRouter from "./cardRoutes.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rotas públicas (não necessitam de autenticação)
router.use("/auth", authRouter);

// Middleware de autenticação para todas as rotas abaixo
router.use(authMiddleware);

// Rotas protegidas (necessitam de autenticação)
router.use("/animes", animesRouter);
router.use("/personagens", personagensRouter);
router.use("/colecoes", collectionRouter);
router.use("/cartas", cardRouter);

export default router;
