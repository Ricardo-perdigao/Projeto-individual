var database = require("../database/config");

function autocadastrar(visitorID) {
    var senha = 'visitante'
    var sql = `
        INSERT INTO usuario (visitorID, nome, senha, email)
        VALUES (
            '${visitorID}',
            'visitante_${visitorID}',
            '${senha}',
            '${visitorID}'
        )
        ON DUPLICATE KEY UPDATE visitorID = VALUES(visitorID);
    `;

    console.log("SQL autocadastro:", sql);
    return database.executar(sql);
}

module.exports = { autocadastrar };
