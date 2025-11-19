var progressoModel = require("../models/progressoModel");

function desbloquear(req, res) {
    var visitorID = req.body.visitorID;
    var pagina = req.body.pagina;

    progressoModel.desbloquear(visitorID, pagina)
        .then(() => res.status(200).json({ ok: true }))
        .catch(erro => {
            console.error(erro);
            res.status(500).json(erro);
        });
}

function registrarAcesso(req, res) {
    var visitorID = req.body.visitorID;
    var pagina = req.body.pagina;

    progressoModel.registrarAcesso(visitorID, pagina)
        .then(() => res.status(200).json({ ok: true }))
        .catch(erro => {
            console.error(erro);
            res.status(500).json(erro);
        });
}

function listar(req, res) {
    var visitorID = req.params.visitorID;

    progressoModel.listar(visitorID)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error(erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    desbloquear,
    registrarAcesso,
    listar
};
