const router = require("express").Router();

const validador = require("../validators/auth");
const { login, registro } = require("../controllers/auth");

router.post("/login", validador.validadorLogin, login);
router.post("/registro", validador.validadorRegistro, registro);

module.exports = router;
