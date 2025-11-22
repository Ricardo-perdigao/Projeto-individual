var database = require("../database/config");

function autenticar(email, senha) {
    var instrucao = `
        SELECT idusuario, nome, email
        FROM usuario
        WHERE email = '${email}'
        AND senha = '${senha}';
    `;
    console.log("SQL autenticar:", instrucao);

    return database.executar(instrucao);
}

module.exports = {
    autenticar
};
