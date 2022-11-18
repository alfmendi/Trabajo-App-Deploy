const jwt = require("jsonwebtoken");

const ErrorAPIPropio = require("../error/ErrorAPIPropio");

const Usuario = require("../models/Usuario");

const autenticacionMiddleware = async (req, res, next) => {
  try {
    const autorizacion = req.headers.authorization;
    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }
    const token = autorizacion.split(" ")[1];
    const tokenDecodificado = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRETO
    );
    if (!tokenDecodificado) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }
    const usuario = await Usuario.findById(tokenDecodificado.usuarioId);
    req.usuario = usuario._id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = autenticacionMiddleware;
