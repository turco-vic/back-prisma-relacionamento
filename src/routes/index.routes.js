import express from "express";

// Importar todas as rotas
import authRouter from "./auth.routes.js";
import animesRouter from "./animeRoutes.js";
import personagensRouter from "./personagemRoutes.js";
import collectionRouter from "./collectionRoutes.js";
import cardRouter from "./cardRoutes.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Rotas públicas
router.use("/auth", authRouter);

// Rotas protegidas
router.use(authMiddleware);

router.use("/animes", animesRouter);
router.use("/personagens", personagensRouter);
router.use("/collections", collectionRouter);
router.use("/cards", cardRouter);

export default router;
