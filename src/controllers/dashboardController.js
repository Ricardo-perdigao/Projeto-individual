var database = require("../database/config");

// Função auxiliar central que contém a lógica de busca de dados de QUIZ e PROGRESSO,
// dado um idVisitante, e envia a resposta ao Front-end.
function fetchAndRespond(idVisitante, res) {
    if (!idVisitante) {
        return res.status(400).json({ erro: "idVisitante é obrigatório." });
    }
    
    // 1. Buscar o visitorID na tabela 'visitante'
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

            var idVisitanteReal = result[0].idvisitante; // ID real na tabela visitante
            var visitorID = result[0].visitorID;
            
            // 2. Buscar resultados do Quiz
            var instrucaoQuiz = `
                SELECT 
                    IFNULL(SUM(qr.acertos), 0) AS acertos, 
                    IFNULL(SUM(qr.totalPerguntas), 0) AS totalPerguntas
                FROM quiz_resultado qr
                WHERE qr.idvisitante = ${idVisitanteReal};
            `;

            // 3. Buscar progresso das páginas
            var instrucaoProgresso = `
                SELECT 
                    pv.pagina, 
                    pv.acessos AS acessos, 
                    pv.desbloqueou AS desbloqueou
                FROM progresso_visitante pv
                WHERE pv.idvisitante = ${idVisitanteReal}
                ORDER BY pv.pagina;
            `;

            // Executa as duas consultas em paralelo
            Promise.all([
                database.executar(instrucaoQuiz),
                database.executar(instrucaoProgresso)
            ])
            .then(([quizRows, progRows]) => {
                const acertos = quizRows[0].acertos || 0;
                const total = quizRows[0].totalPerguntas || 0;
                
                // Cálculo de KPIs
                const totalErros = total - acertos;
                const porcentagemAcerto = total > 0 
                    ? parseFloat(((acertos / total) * 100).toFixed(2)) 
                    : 0.00;

                // Processamento do Progresso
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
                
                // Resposta final que será consumida pelo dashboard.html
                const dadosDashboard = {
                    idVisitante: idVisitanteReal, 
                    visitorID: visitorID,
                    acertos: Number(acertos),
                    totalPerguntas: Number(total),
                    porcentagemAcerto: porcentagemAcerto,
                    totalErros: totalErros,
                    totalPaginasAcessadas: paginasAcessadasDistintas,
                    totalPaginasDesbloqueadas: totalPaginasDesbloqueadas,
                    paginas: paginas, // Labels do gráfico
                    acessos: acessos, // Dados do gráfico
                    progresso: progRows // Dados detalhados (para o rawData no Front-end)
                };

                res.status(200).json(dadosDashboard);
            })
            .catch(error => {
                console.error("Erro ao buscar dados de Quiz e Progresso:", error);
                res.status(500).json({erro: "Erro interno do servidor ao buscar dados de Quiz/Progresso."});
            });
        })
        .catch(error => {
            console.error("Erro na fetchAndRespond - VisitorID:", error);
            res.status(500).json({erro: "Erro interno do servidor ao buscar dados do Visitante."});
        });
}

// 1. Função para buscar dados de um visitante específico (usada pela rota /dados/:idUsuario)
function dadosVisitantePorId(req, res) {
    const idVisitante = req.params.idUsuario; 
    fetchAndRespond(idVisitante, res);
}

// 2. Busca o ID do último visitante cadastrado (usada pela rota /ultimo)
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
            fetchAndRespond(idVisitante, res); // Usa o ID encontrado para buscar os dados
        })
        .catch(error => {
            console.error("Erro ao buscar o último visitante:", error);
            res.status(500).json({erro: "Erro interno do servidor ao buscar o último visitante."});
        });
}

module.exports = {
    dadosVisitantePorId,
    dadosUltimoVisitante
};