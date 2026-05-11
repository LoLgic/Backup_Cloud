import express from "express";

import { createFolder, getFolders } from "../controllers/folderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Crear carpeta
router.post(
  "/",
  authMiddleware,
  createFolder
);

// Obtener carpetas
router.get(
  "/",
  authMiddleware,
  getFolders
);

export default router;