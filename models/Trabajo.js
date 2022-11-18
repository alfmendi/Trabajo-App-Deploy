const mongoose = require("mongoose");

const trabajoSchema = new mongoose.Schema(
  {
    compañia: {
      type: String,
      required: [true, "Debe introducir una compañía"],
    },
    puesto: {
      type: String,
      required: [true, "Debe introducir un puesto"],
    },
    estado: {
      type: String,
      enum: ["pendiente", "entrevistado", "rechazado"],
      default: "pendiente",
    },
    creadoPor: {
      type: mongoose.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trabajo", trabajoSchema);
