require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Paquetes para aumentar la seguridad de la aplicación
const helmet = require("helmet");
const xss = require("xss-clean");

// Conectar con la BBDD
require("./db/conectar");

const routerTokens = require("./routes/tokens");
const routerAuth = require("./routes/auth");
const routerTrabajos = require("./routes/trabajos");

const opcionesCORS = require("./config/opcionesCORS");
const credenciales = require("./middleware/credenciales");
const logger = require("./middleware/logger");
const rutaNoExisteMiddleware = require("./middleware/rutaNoExiste");
const manejadorErrorMiddleware = require("./middleware/manejadorError");

const app = express();

// Middleware

// // Tras hacer una petición con axios y habilitar withCredentials:true, aparece el siguiente error:
// // Access to XMLHttpRequest at 'http://localhost:5000/api/trabajos/6203975d33fd094329603cd4'
// // from origin 'http://localhost:3000' has been blocked by CORS policy:
// // The value of the 'Access-Control-Allow-Origin' header in the response
// // must not be the wildcard '*' when the request's credentials mode is 'include'.
// // The credentials mode of requests initiated by the XMLHttpRequest is controlled
// // by the withCredentials attribute. Para solventarlo, es necesario establecer una lista de origenes con
// // acceso.
// Comprobamos las credenciales antes de CORS
app.use(credenciales);
app.use(cors(opcionesCORS));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(express.static("build"));

// Middleware
app.use(logger);

// Rutas
app.use("/api/tokens", routerTokens);
app.use("/api/auth", routerAuth);
app.use("/api/trabajos", routerTrabajos);

// POR FIN: ESTA SOLUCIÓN ES CORRECTA!!!!!!!!!!!!!
// La aplicación cada vez que se hacía un refresh (F5) llamaba al servidor
// con la dirección que figuraba en el navegador. Esto hacía que cualquier
// dirección que no fuese el raiz definido en app.use(express.static("build"))
// generase un error.
// Para solventarlo, se añade el siguiente código...
// app.get("*", function (request, response) {
//   response.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "./build", "index.html"));
});

// Middleware
// app.use(rutaInvalidaMiddleware);
app.use(manejadorErrorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor ejecutandose en el puerto ${PORT}`)
);
