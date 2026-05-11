import Folder from "../models/Folder.js";

// Crear carpeta
export const createFolder = async (
  req,
  res
) => {

  try {

    const { name } = req.body;

    const folder = await Folder.create({

      name,

      user: req.user.id

    });

    res.status(201).json({

      message: "Carpeta creada",

      folder

    });

  } catch (error) {

    res.status(500).json({

      message: "Error creando carpeta",

      error: error.message

    });

  }

};

// Obtener carpetas usuario
export const getFolders = async (
  req,
  res
) => {

  try {

    const folders = await Folder.find({

      user: req.user.id

    });

    res.json({

      folders

    });

  } catch (error) {

    res.status(500).json({

      message: "Error obteniendo carpetas",

      error: error.message

    });

  }

};