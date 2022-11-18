const bcryptjs = require("bcryptjs");

const Usuario = require("../models/Usuario");

const ErrorAPIPropio = require("../error/ErrorAPIPropio");

// Función para gestionar el login de los usuarios a la aplicación
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }
    const passwordValido = await usuario.comprobarPassword(password);
    if (!passwordValido) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }
    const accessToken = usuario.generarAccessToken();
    const refreshToken = await usuario.generarRefreshToken();
    // Envio el Refresh Token como una httpOnly cookie. Una cookie
    // definida como httpOnly no es accesible por JavaScript,
    // por lo tanto no es accesible a los ataques. Access Token se envía normal.
    // Para hacer pruebas con Postman o Thunder Client se debe deshabilitar secure:true.
    // ES MUY IMPORTANTE HABILITAR SECURE:TRUE YA QUE SI NO SE HACE, EL REFRESH TOKEN NO SE ACTUALIZA
    return res
      .status(200)
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ nombre: usuario.nombre, accessToken });
  } catch (error) {
    return next(error);
  }
};

// Función para gestionar el registro de los usuarios a la aplicación
const registro = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);
    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
    });
    const accessToken = usuario.generarAccessToken();
    const refreshToken = await usuario.generarRefreshToken();
    // Envio el refreshToken como una httpOnly cookie. Una cookie
    // definida como httpOnly no es accesible por JavaScript,
    // por lo tanto no es accesible a los ataques. Access Token se envía normal
    // En producción se debe activar secure: true.
    // Para hacer pruebas con Postman o Thunder Client se debe deshabilitar secure:true.
    // ES MUY IMPORTANTE HABILITAR SECURE:TRUE YA QUE SI NO SE HACE, EL REFRESH TOKEN NO SE ACTUALIZA
    return res
      .status(201)
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ nombre: usuario.nombre, accessToken });
  } catch (error) {
    return next(error);
  }
};

module.exports = { login, registro };
