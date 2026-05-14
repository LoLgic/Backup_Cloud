import cloudinary from "../config/cloudinary.js";
import File from "../models/File.js";
import { v4 as uuidv4 } from "uuid";

import mongoose from "mongoose";

export const uploadFile = async (req, res) => {
  try {

    // Verificar archivo
    if (!req.file) {
      return res.status(400).json({
        message: "No se envió archivo"
      });
    }

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "cloud-backup"
      }
    );

    // Guardar en MongoDB
    const file = await File.create({

      fileName: result.original_filename,

      fileUrl: result.secure_url,

      publicId: result.public_id,

      user: req.user.id,

      folder: req.body.folderId || null

    });

    res.status(201).json({
      message: "Archivo subido correctamente",
      file
    });

  } catch (error) {

    res.status(500).json({
      message: "Error subiendo archivo",
      error: error.message
    });

  }
};

export const getUserFiles = async (req, res) => {
  try {

    const files = await File.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      total: files.length,
      files
    });

  } catch (error) {

    res.status(500).json({
      message: "Error obteniendo archivos",
      error: error.message
    });

  }
};


export const getMyFiles = async (
  req,
  res
) => {

  try {

    const { folderId } = req.query;

    let query = {

      user: req.user.id

    };

    // Filtrar por carpeta
    if (folderId) {

      query.folder =
        new mongoose.Types.ObjectId(folderId);

    } else {

      query.folder = null;

    }

    const files = await File.find(query);

    res.json({

      files

    });

  } catch (error) {

    res.status(500).json({

      message: "Error obteniendo archivos",

      error: error.message

    });

  }

};

export const deleteFile = async (req, res) => {
  try {

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "Archivo no encontrado"
      });
    }

    // Verificar propietario
    if (file.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "No autorizado"
      });
    }

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(file.publicId);

    // Eliminar de MongoDB
    await file.deleteOne();

    res.status(200).json({
      message: "Archivo eliminado correctamente"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error eliminando archivo",
      error: error.message
    });

  }
};

export const shareFile = async (
  req,
  res
) => {

  try {

    const file = await File.findById(
      req.params.id
    );

    if (!file) {

      return res.status(404).json({
        message: "Archivo no encontrado"
      });

    }

    // Verificar propietario
    if (
      file.user.toString() !== req.user.id
    ) {

      return res.status(403).json({
        message: "No autorizado"
      });

    }

    // Generar token único
    file.isPublic = true;

    file.shareToken = uuidv4();

    await file.save();

    res.json({

      message: "Archivo compartido",

      link:
        `${process.env.FRONTEND_URL}/share/${file.shareToken}`

    });

  } catch (error) {

    res.status(500).json({

      message: "Error compartiendo archivo",

      error: error.message

    });

  }

};

export const getPublicFile = async (
  req,
  res
) => {

  try {

    const file = await File.findOne({

      shareToken: req.params.token,

      isPublic: true

    });

    if (!file) {

      return res.status(404).json({

        message: "Archivo no encontrado"

      });

    }

    res.json({

      file

    });

  } catch (error) {

    res.status(500).json({

      message: "Error obteniendo archivo",

      error: error.message

    });

  }

};

export const getAllFiles = async (
  req,
  res
) => {

  try {

    const files = await File.find()
      .populate("user", "email role");

    res.json({

      total: files.length,

      files

    });

  } catch (error) {

    res.status(500).json({

      message: "Error obteniendo archivos",

      error: error.message

    });

  }

};