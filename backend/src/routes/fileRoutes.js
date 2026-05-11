import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import authMiddleware from "../middleware/authMiddleware.js";

import { uploadFile, getUserFiles, deleteFile } from "../controllers/fileController.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

router.get(
  "/my-files",
  authMiddleware,
  getUserFiles
);

router.delete(
  "/:id",
  authMiddleware,
  deleteFile
);

export default router;