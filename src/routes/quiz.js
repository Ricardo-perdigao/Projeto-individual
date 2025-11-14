var express = require("express");
var router = express.Router();

var quizController = require("../controllers/quizController");

router.post("/cadastrar", function (req, res) {

    quizController.cadastrar(req, res);
});

router.get("/listar", function (req, res) {

    quizController.listar(req, res);
});

router.get("/buscar", function (req, res) {

    quizController.buscar(req, res);
});

router.post("/opinar", function (req, res) {

    quizController.opinar(req, res);
});


module.exports = router;