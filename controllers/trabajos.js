const Trabajo = require("../models/Trabajo");

const ErrorAPIPropio = require("../error/ErrorAPIPropio");

// Función para devolver todos las solicitudes de trabajo de un usuario
const conseguirTodosTrabajos = async (req, res, next) => {
  try {
    const usuarioId = req.usuario;
    const trabajos = await Trabajo.find({ creadoPor: usuarioId }).sort(
      "-updatedAt"
    );
    return res.status(200).json(trabajos);
  } catch (error) {
    next(error);
  }
};

// Función para devolver una solicitud de trabajo de un usuario
const conseguirTrabajo = async (req, res, next) => {
  try {
    const trabajoId = req.params.trabajoId;
    const usuarioId = req.usuario;
    const trabajo = await Trabajo.findOne({
      _id: trabajoId,
      creadoPor: usuarioId,
    });
    if (!trabajo) {
      throw new ErrorAPIPropio("404", "Ese identificador de trabajo no existe");
    }
    return res.status(200).json(trabajo);
  } catch (error) {
    next(error);
  }
};

// Función para añadir una solicitud de trabajo de un usuario
const crearTrabajo = async (req, res, next) => {
  try {
    const { compañia, puesto, estado } = req.body;
    const usuarioId = req.usuario;
    const trabajo = await Trabajo.create({
      compañia,
      puesto,
      estado,
      creadoPor: usuarioId,
    });
    return res.status(201).json(trabajo);
  } catch (error) {
    next(error);
  }
};

// Función para modificar una solicitud de trabajo de un usuario
const modificarTrabajo = async (req, res, next) => {
  try {
    const { compañia, puesto, estado } = req.body;
    const trabajoId = req.params.trabajoId;
    const usuarioId = req.usuario;
    const trabajoModificado = await Trabajo.findOneAndUpdate(
      { _id: trabajoId, creadoPor: usuarioId },
      { compañia, puesto, estado },
      { new: true, runValidators: true }
    );
    if (!trabajoModificado) {
      throw new ErrorAPIPropio("404", "Ese identificador de trabajo no existe");
    }
    return res.status(200).json(trabajoModificado);
  } catch (error) {
    next(error);
  }
};

// Función para eliminar una solicitud de trabajo de un usuario
const eliminarTrabajo = async (req, res, next) => {
  try {
    const trabajoId = req.params.trabajoId;
    const usuarioId = req.usuario;
    const trabajadoEliminado = await Trabajo.findOneAndRemove({
      _id: trabajoId,
      creadoPor: usuarioId,
    });
    if (!trabajadoEliminado) {
      throw new ErrorAPIPropio("404", "Ese identificador de trabajo no existe");
    }

    return res.status(200).json({ mensaje: "Trabajo eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  conseguirTodosTrabajos,
  conseguirTrabajo,
  crearTrabajo,
  modificarTrabajo,
  eliminarTrabajo,
};
