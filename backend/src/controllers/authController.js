import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

import RefreshToken from "../models/RefreshToken.js";

export const register = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    // Verificar si existe
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "El usuario ya existe"
      });
    }

    // Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: "Error registrando usuario",
      error: error.message
    });

  }
};

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Usuario no encontrado"
      });
    }

    // Comparar password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Contraseña incorrecta"
      });
    }

    // Generar token
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn:
          process.env.REFRESH_TOKEN_EXPIRES
      }
    );

    await RefreshToken.create({
      token: refreshToken,
      user: user._id
    });

    res.status(200).json({
      message: "Login exitoso",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    res.status(500).json({
      message: "Error en login",
      error: error.message
    });

  }
};