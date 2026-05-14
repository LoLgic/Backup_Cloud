import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
dotenv.config();

connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/token", tokenRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API Backup Cloud funcionando 🚀"
  });
});



const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});