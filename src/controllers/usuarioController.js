var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email || !senha) {
        return res.status(400).send("Email ou senha não enviados.");
    }

    usuarioModel.autenticar(email, senha)
        .then(resultado => {
            if (resultado.length === 1) {
                var usuario = resultado[0];

                res.status(200).json({
                    idUsuario: usuario.idusuario,
                    nome: usuario.nome,
                    email: usuario.email
                });

            } else {
                res.status(403).send("Credenciais inválidas.");
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
