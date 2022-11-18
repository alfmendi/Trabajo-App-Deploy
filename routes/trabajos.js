const autenticacionMiddleware = require("../middleware/autenticacion");

const validador = require("../validators/trabajos");

const {
  conseguirTodosTrabajos,
  conseguirTrabajo,
  crearTrabajo,
  modificarTrabajo,
  eliminarTrabajo,
} = require("../controllers/trabajos");

const router = require("express").Router();

router.get("/", autenticacionMiddleware, conseguirTodosTrabajos);
router.get("/:trabajoId", autenticacionMiddleware, conseguirTrabajo);
router.post("/", autenticacionMiddleware, validador, crearTrabajo);
router.patch(
  "/:trabajoId",
  autenticacionMiddleware,
  validador,
  modificarTrabajo
);
router.delete("/:trabajoId", autenticacionMiddleware, eliminarTrabajo);

module.exports = router;
