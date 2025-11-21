var quizModel = require("../models/quizModel");

function listar(req, res) {
    quizModel.listar()
        .then(r => res.status(200).json(r))
        .catch(e => {
            console.error(e);
            res.status(500).json(e);
        });
}

function buscar(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ erro: "ID é obrigatório." });
    }

    quizModel.buscar(id)
        .then(r => {
            if (r.length === 0) {
                return res.status(404).json({ erro: "Pergunta não encontrada." });
            }
            res.status(200).json(r[0]);
        })
        .catch(e => {
            console.error(e);
            res.status(500).json(e);
        });
}

function cadastrar(req, res) {
    const { pergunta, imagem, alternativaA, alternativaB, alternativaC, alternativaD, alternativaCorreta } = req.body;

    if (!pergunta) {
        return res.status(400).json({ erro: "Pergunta é obrigatória." });
    }

    quizModel.cadastrar(pergunta, imagem, alternativaA, alternativaB, alternativaC, alternativaD, alternativaCorreta)
        .then(r => res.status(201).json(r))
        .catch(e => {
            console.error(e);
            res.status(500).json(e);
        });
}

function salvarResultado(req, res) {
    const { visitorID, acertos, totalPerguntas } = req.body;

    if (!visitorID || acertos == null || totalPerguntas == null) {
        return res.status(400).json({ erro: "visitorID, acertos e totalPerguntas são obrigatórios." });
    }

    quizModel.salvarResultado(visitorID, acertos, totalPerguntas)
        .then(r => res.status(201).json(r))
        .catch(e => {
            console.error(e);
            res.status(500).json(e);
        });
}

module.exports = {
    listar,
    buscar,
    cadastrar,
    salvarResultado
};
