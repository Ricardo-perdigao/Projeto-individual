var autocadastroModel = require("../models/autocadastroModel");

function autocadastro(req, res) {
    var visitorID = req.body.visitorID;

    if (!visitorID) {
        return res.status(400).json("visitorID ausente");
    }

    autocadastroModel.autocadastrar(visitorID)
        .then(() => res.status(200).json("Autocadastro OK"))
        .catch(err => {
            console.error("Erro no autocadastro:", err);
            res.status(500).json(err);
        });
}

module.exports = { autocadastro };
