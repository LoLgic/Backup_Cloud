const adminMiddleware = (
  req,
  res,
  next
) => {

  if (req.user.role !== "admin") {

    return res.status(403).json({

      message: "Acceso denegado"

    });

  }

  next();

};

export default adminMiddleware;