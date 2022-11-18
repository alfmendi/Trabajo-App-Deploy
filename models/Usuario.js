const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Longitud mínima de nombre debe ser 3"],
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Introduce un email válido"],
      match:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Longitud mínima de password debe ser 6"],
      minlength: 6,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Middleware que se ejecuta antes de hacer el save del documento en la colección
// Esto permite aligerar la función registro. En caso de error, la función registro
// devolverá el error al ejecutar el catch correspondiente
// usuarioSchema.pre("save", async function (next) {
//   const salt = await bcryptjs.genSalt(10);
//   const passwordHash = await bcryptjs.hash(this.password, salt);
//   this.password = passwordHash;
//   //   Según la documentación, al usar async,await se puede quitar el next()
//   //   next();
// });

// Función para generar el accessToken. Al definir esta función, cada documento
// podrá hacer uso de ella. El tiempo de expiración para este token debe ser
// de entre 5-15 minutos.
usuarioSchema.methods.generarAccessToken = function () {
  return jwt.sign(
    { usuarioId: this._id },
    process.env.JWT_ACCESS_TOKEN_SECRETO,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRACION,
    }
  );
};

// Función para generar el refreshToken. Al definir esta función, cada documento
// podrá hacer uso de ella. El tiempo de expiración de este token debe ser mayor.
usuarioSchema.methods.generarRefreshToken = async function () {
  const refreshToken = jwt.sign(
    { usuarioId: this._id },
    process.env.JWT_REFRESH_TOKEN_SECRETO,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRACION,
    }
  );
  this.refreshToken = refreshToken;
  this.save();
  return refreshToken;
};

// Función para comprobar que el password enviado en el login coincide con
// el password almacenado en la BBDD
usuarioSchema.methods.comprobarPassword = function (password) {
  const resultado = bcryptjs.compare(password, this.password);
  return resultado;
};

module.exports = mongoose.model("Usuario", usuarioSchema);
