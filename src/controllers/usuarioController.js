var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var login = req.body.emailServer;
    var senha = req.body.senhaServer;
    var visitorID = req.body.visitorID;

    if (!login || !senha) {
        return res.status(400).send("Login ou senha não enviados.");
    }

    usuarioModel.autenticar(login, senha)
        .then(resultado => {
            if (resultado.length === 1) {
                var usuario = resultado[0];
                if (visitorID && (!usuario.visitorID || usuario.visitorID !== visitorID)) {
                    usuarioModel.vincularVisitorID(usuario.idusuario, visitorID)
                        .then(() => {
                            console.log("visitorID vinculado ao usuário:", usuario.idusuario);
                        })
                        .catch(err => console.error("Erro ao vincular visitorID:", err));
                }

                res.status(200).json({
                    idUsuario: usuario.idusuario,
                    nome: usuario.nome,
                    email: usuario.email,
                    visitorID: visitorID || usuario.visitorID
                });
            } else {
                res.status(403).send("Login ou senha inválidos.");
            }
        })
        .catch(erro => {
            console.error("Erro autenticar:", erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    autenticar
};