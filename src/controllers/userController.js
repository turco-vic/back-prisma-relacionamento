import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.js";

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
          .json({ error: "Todos os campos são obrigatórios" });
      }

      // Verificar se o usuário já existe
      const userExists = await UserModel.findByEmail(email);
      if (userExists) {
        return res.status(400).json({ error: "Este email já está em uso" });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar objeto do usuário
      const data = {
        name,
        email,
        password: hashedPassword,
      };

      // Criar o usuário
      const user = await UserModel.create(data);

      return res.status(201).json({
        message: "Usuário criado com sucesso",
        user,
      });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({ error: "Erro ao registrar usuário" });
    }
  }

  // Login de usuário
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email e senha são obrigatórios" });
      }

      // Verificar se o usuário existe
      const user = await UserModel.findByEmail(email);

      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "sua_chave_secreta_padrao",
        { expiresIn: "24h" }
      );

      return res.json({
        message: "Login realizado com sucesso",
        token,
        user,
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({ error: "Erro ao fazer login" });
    }
  }

  // Obter informações do usuário atual
  async getMe(req, res) {
    try {
      const user = await UserModel.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Não retornar a senha
      const { password: _, ...userWithoutPassword } = user;

      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Erro ao obter informações do usuário:", error);
      res.status(500).json({ error: "Erro ao obter informações do usuário" });
    }
  }

  // Atualizar usuário
  async updateUser(req, res) {
    try {
      const { name, email, password } = req.body;
      const userId = req.userId; // ID do usuário autenticado

      // Verificar se o usuário existe
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Preparar dados para atualização
      const updateData = {};

      if (name) updateData.name = name;

      if (email) {
        // Verificar se o email já está em uso por outro usuário
        if (email !== user.email) {
          const emailExists = await UserModel.findByEmail(email);
          if (emailExists) {
            return res.status(400).json({ error: "Este email já está em uso" });
          }
        }

        updateData.email = email;
      }

      if (password) {
        // Hash da nova senha
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Atualizar o usuário
      const updatedUser = await UserModel.update(userId, updateData);

      return res.json({
        message: "Usuário atualizado com sucesso",
        user,
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  }

  // Excluir usuário
  async deleteUser(req, res) {
    try {
      const userId = req.userId; // ID do usuário autenticado

      // Verificar se o usuário existe
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Excluir o usuário
      await UserModel.delete(userId);

      return res.json({
        message: "Usuário excluído com sucesso",
      });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      res.status(500).json({ error: "Erro ao excluir usuário" });
    }
  }
}

export default new AuthController();
