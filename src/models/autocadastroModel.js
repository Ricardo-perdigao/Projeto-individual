var database = require("../database/config");

async function autocadastrar(visitorID) {

    var sqlCheck = `
        SELECT * FROM visitante WHERE visitorID = '${visitorID}'
    `;

    const result = await database.executar(sqlCheck);

    if (result.length > 0) {
        return result;
    }

    var sqlInsert = `
        INSERT INTO visitante (visitorID) 
        VALUES ('${visitorID}');
    `;

    return database.executar(sqlInsert);
}

module.exports = { autocadastrar };
