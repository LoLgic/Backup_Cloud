import jwt from "jsonwebtoken";

import RefreshToken
from "../models/RefreshToken.js";

export const refreshAccessToken =
async (req, res) => {

  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {

      return res.status(401).json({
        message: "Refresh token requerido"
      });

    }

    const tokenExists =
      await RefreshToken.findOne({
        token: refreshToken
      });

    if (!tokenExists) {

      return res.status(403).json({
        message: "Refresh token inválido"
      });

    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const newAccessToken = jwt.sign(
      {
        id: decoded.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN
      }
    );

    res.json({

      accessToken:
        newAccessToken

    });

  } catch (error) {

    res.status(403).json({

      message:
        "Refresh token inválido"

    });

  }

};