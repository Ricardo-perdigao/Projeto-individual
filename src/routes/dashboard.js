var express = require("express");
var router = express.Router();
var dashboardController = require("../controllers/dashboardController");

router.get("/dados/:idUsuario", function (req, res) {
    dashboardController.dadosVisitantePorId(req, res);
});

router.get("/ultimo", function (req, res) {
    dashboardController.dadosUltimoVisitante(req, res);
});

module.exports = router;