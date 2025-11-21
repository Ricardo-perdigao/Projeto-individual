var database = require("../database/config");

function listar() {
    console.log("Executando quizModel.listar()");
    var instrucao = `
        SELECT id, pergunta, imagem, alternativaA, alternativaB, alternativaC, alternativaD, alternativaCorreta
        FROM quiz;
    `;
    console.log("SQL:", instrucao);
    return database.executar(instrucao);
}

function buscar(id) {
    console.log("Executando quizModel.buscar() - id:", id);
    var instrucao = `
        SELECT id, pergunta, imagem, alternativaA, alternativaB, alternativaC, alternativaD, alternativaCorreta
        FROM quiz
        WHERE id = ${id};
    `;
    console.log("SQL:", instrucao);
    return database.executar(instrucao);
}

function cadastrar(pergunta, imagem, alternativaA, alternativaB, alternativaC, alternativaD, alternativaCorreta) {
    console.log("Executando quizModel.cadastrar()");
    var instrucao = `
        INSERT INTO quiz (pergunta, imagem, alternativaA, alternativaB, alternativaC, alternativaD, alternativaCorreta)
        VALUES ('${pergunta}', ${imagem ? `'${imagem}'` : "NULL"}, '${alternativaA}', '${alternativaB}', '${alternativaC}', '${alternativaD}', '${alternativaCorreta}');
    `;
    console.log("SQL:", instrucao);
    return database.executar(instrucao);
}

function garantirVisitante(visitorID) {
    var instrucao = `
        INSERT INTO visitante (visitorID)
        VALUES ('${visitorID}')
        ON DUPLICATE KEY UPDATE visitorID = visitorID;
    `;
    return database.executar(instrucao);
}

function salvarResultado(visitorID, acertos, totalPerguntas) {
    console.log("Executando quizModel.salvarResultado()");
    return garantirVisitante(visitorID)
    .then(() => {
        var instrucao = `
            INSERT INTO quiz_resultado (idVisitante, acertos, totalPerguntas)
            SELECT idVisitante, ${acertos}, ${totalPerguntas}
            FROM visitante
            WHERE visitorID = '${visitorID}';
        `;
        console.log("SQL:", instrucao);
        return database.executar(instrucao);
    });
}

module.exports = {
    listar,
    buscar,
    cadastrar,
    salvarResultado
};
