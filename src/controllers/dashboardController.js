var database = require("../database/config");

function fetchAndRespond(idVisitante, res) {
    if (!idVisitante) {
        return res.status(400).json({ erro: "idVisitante é obrigatório." });
    }

    var instrucaoVisitor = `
    SELECT idvisitante, visitorID
    FROM visitante
    WHERE idvisitante = ${idVisitante}; 
`;
    database.executar(instrucaoVisitor)
        .then(result => {
            if (!result || result.length === 0) {
                return res.status(404).json({ erro: "Visitante não encontrado." });
            }

            var idVisitanteReal = result[0].idvisitante;
            var idVisitante = result[0].idvisitante;
            var visitorID = result[0].visitorID;

            var instrucaoQuiz = `
                SELECT 
                    IFNULL(SUM(qr.acertos), 0) AS acertos, 
                    IFNULL(SUM(qr.totalPerguntas), 0) AS totalPerguntas
                FROM quiz_resultado qr
                WHERE qr.idvisitante = ${idVisitanteReal};
            `;

            var instrucaoProgresso = `
    SELECT 
        pagina, 
        acessos, 
        desbloqueou
    FROM progresso_visitante
    WHERE idVisitante = ${idVisitante}
    ORDER BY pagina;
`;

            Promise.all([
                database.executar(instrucaoQuiz),
                database.executar(instrucaoProgresso)
            ])
                .then(([quizRows, progRows]) => {
                    const acertos = quizRows[0].acertos || 0;
                    const total = quizRows[0].totalPerguntas || 0;

                    const totalErros = total - acertos;
                    const porcentagemAcerto = total > 0
                        ? parseFloat(((acertos / total) * 100).toFixed(2))
                        : 0.00;

                    let paginas = [];
                    let acessos = [];
                    let totalPaginasDesbloqueadas = 0;
                    let paginasAcessadasDistintas = progRows.length;

                    for (let i = 0; i < progRows.length; i++) {
                        const row = progRows[i];
                        paginas.push(row.pagina);
                        acessos.push(row.acessos);
                        if (row.desbloqueou === 1) {
                            totalPaginasDesbloqueadas++;
                        }
                    }

                    const dadosDashboard = {
                        idVisitante: idVisitanteReal,
                        visitorID: visitorID,
                        acertos: Number(acertos),
                        totalPerguntas: Number(total),
                        porcentagemAcerto: porcentagemAcerto,
                        totalErros: totalErros,
                        totalPaginasAcessadas: paginasAcessadasDistintas,
                        totalPaginasDesbloqueadas: totalPaginasDesbloqueadas,
                        paginas: paginas,
                        acessos: acessos,
                        progresso: progRows
                    };

                    res.status(200).json(dadosDashboard);
                })
                .catch(error => {
                    console.error("Erro ao buscar dados de Quiz e Progresso:", error);
                    res.status(500).json({ erro: "Erro interno do servidor ao buscar dados de Quiz/Progresso." });
                });
        })
        .catch(error => {
            console.error("Erro na fetchAndRespond - VisitorID:", error);
            res.status(500).json({ erro: "Erro interno do servidor ao buscar dados do Visitante." });
        });
}

function dadosVisitantePorId(req, res) {
    const idVisitante = req.params.idUsuario;
    fetchAndRespond(idVisitante, res);
}

function dadosUltimoVisitante(req, res) {
    var instrucaoBuscarUltimo = `
        SELECT idvisitante
        FROM visitante
        ORDER BY idvisitante DESC
        LIMIT 1;
    `;

    database.executar(instrucaoBuscarUltimo)
        .then(result => {
            if (!result || result.length === 0) {
                return res.status(404).json({ erro: "Nenhum visitante encontrado no banco de dados." });
            }
            const idVisitante = result[0].idvisitante;
            fetchAndRespond(idVisitante, res);
        })
        .catch(error => {
            console.error("Erro ao buscar o último visitante:", error);
            res.status(500).json({ erro: "Erro interno do servidor ao buscar o último visitante." });
        });
}

module.exports = {
    dadosVisitantePorId,
    dadosUltimoVisitante
};