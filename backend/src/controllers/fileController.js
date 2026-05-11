import cloudinary from "../config/cloudinary.js";
import File from "../models/File.js";

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
    const newFile = await File.create({
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id
    });

    res.status(201).json({
      message: "Archivo subido correctamente",
      file: newFile
    });

  } catch (error) {

    res.status(500).json({
      message: "Error subiendo archivo",
      error: error.message
    });

  }
};