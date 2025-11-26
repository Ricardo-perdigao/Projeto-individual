var database = require("../database/config");

 function garantirVisitante(visitorID) {
   var sql = `
        INSERT INTO visitante (visitorID)
        VALUES ('${visitorID}')
        ON DUPLICATE KEY UPDATE visitorID = visitorID;
    `;
    return database.executar(sql);
} 

function desbloquear(visitorID, pagina) {
    return garantirVisitante(visitorID).then(() => {
        var sql = `
            INSERT INTO progresso_visitante (idVisitante, pagina, desbloqueou)
            SELECT idVisitante, '${pagina}', 1
            FROM visitante WHERE visitorID = '${visitorID}'        `;
        return database.executar(sql);
    });
}

function registrarAcesso(visitorID, pagina) {
    return garantirVisitante(visitorID).then(() => {
        var sql = `
            INSERT INTO progresso_visitante (idVisitante, pagina, acessos)
            SELECT idVisitante, '${pagina}', 1
            FROM visitante WHERE visitorID = '${visitorID}'`;
        return database.executar(sql);
    });
}

function listar(visitorID) {
    var sql = `
        SELECT pagina, desbloqueou, acessos,
        FROM progresso_visitante
        WHERE idVisitante = (SELECT idVisitante FROM visitante WHERE visitorID = '${visitorID}');
    `;
    return database.executar(sql);
}

module.exports = {
    desbloquear,
    registrarAcesso,
    listar
};