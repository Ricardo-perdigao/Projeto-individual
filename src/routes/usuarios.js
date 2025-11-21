var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

// Variável para fazer o auto cadastro em cima do... VisitorID 
var autocadastroController = require("../controllers/autocadastroController");
router.post("/autocadastro", function (req, res) {
    autocadastroController.autocadastro(req, res);
});


module.exports = router;