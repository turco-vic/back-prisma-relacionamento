import express from "express";
import { config } from "dotenv";
import cors from "cors"; // Importa o middleware CORS

import animesRouter from "./routes/animeRoutes.js";
import collectionRouter from "./routes/collectionRoutes.js";
import cardRouter from "./routes/cardRoutes.js";
import authRouter from "./routes/auth.routes.js";

config(); // Carrega variáveis de ambiente do arquivo .env
const port = process.env.PORT || 4001; // Define a porta do servidor

// Inicializa o Express
const app = express();
app.use(cors()); // Habilita CORS para todas as rotas

app.use(express.json()); // Parse de JSON

app.use("/animes", animesRouter); // Usar as rotas de animes
app.use("/colecoes", collectionRouter); // Usar as rotas de coleções
app.use("/cartas", cardRouter); // Usar as rotas de cartas
app.use("/auth", authRouter); // Usar as rotas de autenticação

// Rota base para verificar se o servidor está rodando
app.get("/", (req, res) => {
  res.json({ message: "API de Coleção de Animes funcionando!" });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
