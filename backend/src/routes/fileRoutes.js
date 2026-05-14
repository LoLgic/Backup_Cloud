import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import authMiddleware from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

import { uploadFile, getMyFiles, deleteFile, shareFile, getPublicFile, getAllFiles } from "../controllers/fileController.js";

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
  getMyFiles
);

router.delete(
  "/:id",
  authMiddleware,
  deleteFile
);

router.put(
  "/share/:id",
  authMiddleware,
  shareFile
);

router.get(
  "/public/:token",
  getPublicFile
);

router.get(
  "/admin/all-files",
  authMiddleware,
  adminMiddleware,
  getAllFiles
);

export default router;