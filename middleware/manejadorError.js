const manejadorErrorMiddleware = (err, req, res, next) => {
  // Creo un error personalizado para devolver a la aplicación cliente
  let errorPersonalizado = {
    // set default
    codigoEstado: err.codigoEstado || 500,
    mensaje: err.message || "Error en el servidor",
  };

  // Si existe un error de validación desde express-validator, genero un error
  if (err.errors && !err.name && Array.isArray([err.errors])) {
    errorPersonalizado.mensaje = err.errors.map((elemento) => elemento.msg);
    errorPersonalizado.codigoEstado = 400;
  }

  // Si existe un error de validación desde Mongoose, genero un error
  if (err.name === "ValidationError") {
    errorPersonalizado.mensaje = Object.values(err.errors).map(
      (elemento) => elemento.message
    );
    errorPersonalizado.codigoEstado = 400;
  }

  // Si existe un error de jwt expired, genero un error
  if (err.name === "TokenExpiredError") {
    errorPersonalizado.mensaje = "La sesión ha expirado";
    errorPersonalizado.codigoEstado = 401;
  }

  // Si existe un error de valor duplicado, genero un error
  if (err.code && err.code === 11000) {
    errorPersonalizado.mensaje = `Ya existe un usuario con ese ${Object.keys(
      err.keyValue
    )}`;
    errorPersonalizado.codigoEstado = 400;
  }

  // Si existe un error de cast, genero un error
  // Esto funciona bien porque no hay más modelos que puedan generar
  // este tipo de error. En el momento que haya algún otro modelo
  // que pueda genera este error, será necesario comprobar también
  // que modelo ha generado ese error.
  if (err.name === "CastError") {
    errorPersonalizado.mensaje = `No existe la solicitud de trabajo con id: ${err.value}`;
    errorPersonalizado.codigoEstado = 404;
  }

  return res
    .status(errorPersonalizado.codigoEstado)
    .json({ mensaje: errorPersonalizado.mensaje });
};

module.exports = manejadorErrorMiddleware;
