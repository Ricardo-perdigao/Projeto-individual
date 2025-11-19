var express = require("express");
var router = express.Router();

var progressoController = require("../controllers/progressoController");

router.post("/desbloquear", function (req, res) {
    progressoController.desbloquear(req, res);
});

router.post("/acesso", function (req, res) {
    progressoController.registrarAcesso(req, res);
});

router.get("/listar/:visitorID", function (req, res) {
    progressoController.listar(req, res);
});

module.exports = router;
