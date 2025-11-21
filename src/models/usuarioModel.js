var database = require("../database/config");

function autenticar(login, senha) {
    var login_curto = login.substring(0, 8); 
    var senha = 'visitante'

    var instrucao = `
        SELECT idvisitante, visitorID
        FROM visitante
        WHERE 
            (
                LEFT(visitorID, 8) = '${login_curto}' 
            )
        AND senha = '${senha}';
    `;
    console.log("SQL autenticar:", instrucao);
    return database.executar(instrucao);
}

function vincularVisitorID(idUsuario, visitorID) {
    var instrucao = `
        UPDATE visitante
        SET visitorID = '${visitorID}'
        WHERE idvisitante = ${idUsuario};
    `;
    console.log("SQL vincularVisitorID:", instrucao);
    return database.executar(instrucao);
}

module.exports = {
    autenticar,
    vincularVisitorID
};
