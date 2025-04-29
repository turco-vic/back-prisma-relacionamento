import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

class AuthController {
  // Listar todos os usuários
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      res.status(500).json({ error: "Erro ao listar usuários" });
    }
  }

  // Registrar novo usuário
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Os campos nome, email e senha são obrigatórios!" });
      }

      // Verificar se o usuário já existe
      const userExists = await UserModel.findByEmail(email);
      if (userExists) {
        return res.status(400).json({ error: "Este email já está em uso!" });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar objeto do usuário
      const data = {
        name,
        email,
        password: hashedPassword,
      };

      // Criar usuário
      const user = await UserModel.create(data);

      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        user,
      });
    } catch (error) {
      console.error("Erro ao criar um novo usuário: ", error);
      res.status(500).json({ error: "Erro ao criar um novo usuário" });
    }
  }
}

export default new AuthController();
