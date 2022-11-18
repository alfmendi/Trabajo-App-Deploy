const { body, validationResult } = require("express-validator");

// Función que comprueba si existen errores de validación en el servidor empleando express-validator.
// En caso afirmativo, devuelve un objeto con los diferentes errores
const comprobadorErrores = (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next({ errors: errors.array({ onlyFirstError: true }) });
  }
  next();
};

const nombre = body("nombre", "Longitud mínima de nombre debe ser 3")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isLength({ min: 3 });

const email = body("email", "Introduce un email válido")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .isEmail()
  .escape();

const password = body(
  "password",
  "Longitud mínima de password debe ser 6"
).isLength({
  min: 6,
});

// Validador para comprobar que los campos enviados en el login son válidos
const validadorLogin = [email, password, comprobadorErrores];

// Validador para comprobar que los campos enviados en el registro son válidos
const validadorRegistro = [nombre, email, password, comprobadorErrores];

const validador = { validadorLogin, validadorRegistro };

module.exports = validador;
