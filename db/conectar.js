const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado correctamente con MongoDB..."))
  .catch((error) => console.log("No se ha podido conectar con MongoDB..."));
