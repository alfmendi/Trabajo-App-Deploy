const router = require("express").Router();

const {
  refrescarAccessToken,
  borrarRefreshToken,
} = require("../controllers/tokens");

router.get("/refrescarAccessToken", refrescarAccessToken);
router.get("/borrarRefreshToken", borrarRefreshToken);

module.exports = router;
