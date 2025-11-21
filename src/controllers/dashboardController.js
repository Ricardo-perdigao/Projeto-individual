var database = require("../database/config");

function dadosUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    if (!idUsuario) {
        return res.status(400).json({ erro: "idUsuario é obrigatório." });
    }

    var instrucaoVisitor = `
        SELECT visitorID
        FROM usuario
        WHERE idusuario = ${database.escape ? database.escape(idUsuario) : idUsuario};
    `;

    database.executar(instrucaoVisitor)
    .then(result => {
        if (!result || result.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        var visitorID = result[0].visitorID;
        if (!visitorID) {
            return res.status(200).json({
                visitorID: null,
                acertos: 0,
                totalPerguntas: 0,
                paginas: [],
                acessos: [],
                progresso: []
            });
        }

        var instrucaoQuiz = `
            SELECT (SUM(qr.acertos),0) AS acertos, (SUM(qr.totalPerguntas),0) AS totalPerguntas
            FROM quiz_resultado qr
            JOIN visitante v ON qr.idvisitante = v.idvisitante
            WHERE v.visitorID = ${database.escape ? database.escape(visitorID) : "'" + visitorID + "'"};
        `;

        var instrucaoProgresso = `
            SELECT pv.pagina, (SUM(pv.acessos),0) AS acessos, (MAX(pv.desbloqueou),0) AS desbloqueou
            FROM progresso_visitante pv
            JOIN visitante v ON pv.idvisitante = v.idvisitante
            WHERE v.visitorID = ${database.escape ? database.escape(visitorID) : "'" + visitorID + "'"}
            GROUP BY pv.pagina;
        `;

        return Promise.all([ database.executar(instrucaoQuiz), database.executar(instrucaoProgresso) ])
            .then(([quizRows, progRows]) => {
                var acertos = 0, total = 0;
                if (quizRows && quizRows.length>0) {
                    acertos = quizRows[0].acertos || 0;
                    total = quizRows[0].totalPerguntas || 0;
                }

                var paginas = [];
                var acessos = [];
                progRows = progRows || [];
                progRows.forEach(r => {
                    paginas.push(r.pagina);
                    acessos.push(Number(r.acessos));
                });

                res.status(200).json({
                    visitorID: visitorID,
                    acertos: Number(acertos),
                    totalPerguntas: Number(total),
                    paginas: paginas,
                    acessos: acessos,
                    progresso: progRows
                });
            });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
}

module.exports = {
    dadosUsuario
};
