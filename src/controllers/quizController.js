var quizModel = require("../models/quizModel");



function cadastrar(req, res) {
    var Usuario = req.body.UsuarioServer
    var Aproveitamento = req.body.AproveitamentoServer;
    var QtdAcertos = req.body.TotalAcertosServer;

    if (Usuario == undefined) {
        res.status(400).send("Seu Usuario está undefined!");
    }
    else if (Aproveitamento == undefined) {
        res.status(400).send("Seu Aproveitamento está undefined!");
    }
    else if (QtdAcertos == undefined) {
        res.status(400).send("Seu QtdAcertos está undefined!");
    }

    quizModel.cadastrar(Usuario, Aproveitamento, QtdAcertos)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar o cadastro! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function opinar(req, res) {
    var Usuario = req.body.UsuarioServer
    var avaliação = req.body.avaliaçãoServer

    if (Usuario == undefined) {
        res.status(400).send("Seu Usuário está undefined!");
    }
    else if (avaliação == undefined) {
        res.status(400).send("Sua avaliação está undefined!");
    }

    quizModel.opinar(Usuario, avaliação)
        .then(  
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar o cadastro! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function listar(req, res) {

    quizModel.listar()
        .then(
            function (resultado) {
                res.status(200).json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar a busca Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function buscar(req, res) {

    quizModel.buscar()
        .then(
            function (resultado) {
                res.status(200).json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar a busca Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}
module.exports = {
    listar,
    cadastrar,
    opinar,
    buscar
}