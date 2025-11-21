var progressoModel = require("../models/progressoModel");

function desbloquear(req, res) {
    const { visitorID, pagina } = req.body;

    if (!visitorID || !pagina) {
        return res.status(400).json({ erro: "visitorID e pagina são obrigatórios." });
    }

    progressoModel.desbloquear(visitorID, pagina)
        .then(r => res.status(200).json(r))
        .catch(e => {
            console.error(e);
            res.status(500).json(e);
        });
}

function registrarAcesso(req, res) {
    const { visitorID, pagina } = req.body;

    if (!visitorID || !pagina) {
        return res.status(400).json({ erro: "visitorID e pagina são obrigatórios." });
    }

    progressoModel.registrarAcesso(visitorID, pagina)
        .then(r => res.status(200).json(r))
        .catch(e => {
            console.error(e);
            res.status(500).json(e);
        });
}

function listar(req, res) {
    const visitorID = req.params.visitorID;

    if (!visitorID) {
        return res.status(400).json({ erro: "visitorID é obrigatório." });
    }

    progressoModel.listar(visitorID)
        .then(r => res.status(200).json(r))
        .catch(e => {
            console.error(e);
            res.status(500).json(e);
        });
}

module.exports = {
    desbloquear,
    registrarAcesso,
    listar
};
