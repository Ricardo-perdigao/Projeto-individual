var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/dados/:idUsuario", function(req, res) {
    dashboardController.dadosUsuario(req, res);
});

module.exports = router;