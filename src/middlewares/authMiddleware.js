import jwt from "jsonwebtoken";

// Middleware para verificar o token JWT
const authMiddleware = (req, res, next) => {
  // Obter o token do cabeçalho Authorization
  const authHeader = req.headers.authorization;

  // Verificar se o token existe
  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // O formato do cabeçalho deve ser "Bearer TOKEN"
  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ error: "Erro de formato do token" });
  }

  const [scheme, token] = parts;

  // Verificar se o formato começa com "Bearer"
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token mal formatado" });
  }

  // Verificar se o token é válido
  jwt.verify(
    token,
    process.env.JWT_SECRET || "sua_chave_secreta_padrao",
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido" });
      }

      // Se o token for válido, salva o ID do usuário na requisição
      req.userId = decoded.id;
      return next();
    }
  );
};

export default authMiddleware;
