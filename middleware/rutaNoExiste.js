const rutaNoExisteMiddleware = (req, res) => {
  return res.status(404).json({ mensaje: "Esa ruta no existe" });
};

module.exports = rutaNoExisteMiddleware;
