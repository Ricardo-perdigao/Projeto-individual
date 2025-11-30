var database = require("../database/config");
// Meu fetch de 2 a 93
function fetchvisitante(idVisitante, res) {
    if (!idVisitante) {
        return res.status(400).json({ erro: "Não há id do visitante"});
    } // Verificar se o visitante foi puxado devidamente ou não

    var instrucaoVisitor = `
    SELECT idvisitante, visitorID
    FROM visitante
    WHERE idvisitante = ${idVisitante}; 
`;
    database.executar(instrucaoVisitor)
        .then(resultado => {
            if (!resultado || resultado.length === 0) {
                return res.status(404).json({ erro: "Visitante não encontrado." }); // verificar se o visitante foi encontrado no banco de dados
            }

            var idVisitante = resultado[0].idvisitante;
            var visitorID = resultado[0].visitorID;

            // verificar no banco os valores solicitados
            var instrucaoQuiz = `
                SELECT 
                    IFNULL(SUM(quiz_resultado.acertos), 0) AS acertos, 
                    IFNULL(SUM(quiz_resultado.totalPerguntas), 0) AS totalPerguntas
                FROM quiz_resultado
                WHERE quiz_resultado.idvisitante = ${idVisitante};
            `;
            // a mesma coisa da de cima, mas para o progresso
            var instrucaoProgresso = ` 
             SELECT 
                pagina, 
                acessos, 
                desbloqueou
            FROM progresso_visitante
            WHERE idVisitante = ${idVisitante}
            ORDER BY pagina;
`;

            // A promise executa e trata ambas as consultas do banco de dados, 
            Promise.all([
                database.executar(instrucaoQuiz),
                database.executar(instrucaoProgresso)
            ])
                .then(([quizTentativa, progTentativa]) => {
                    const acertos = Number(quizTentativa[0].acertos || 0);
                    const total = Number(quizTentativa[0].totalPerguntas || 0);

                    const totalErros = total - acertos;
                    const porcentagemAcerto = total > 0
                        ? parseFloat(((acertos / total) * 100).toFixed(2))
                        : 0.00;

                    let paginas = [];
                    let acessos = [];
                    let totalPaginasDesbloqueadas = 0;
                    
                    // percorre meu progresso, verificando se foi ou não desbloqueado, e quando não, ele não armazena o valor, caso contrário dá um push no meu vetor
                    for (let i = 0; i < progTentativa.length; i++) {
                        const tentativas = progTentativa[i];
                        paginas.push(tentativas.pagina);
                        acessos.push(tentativas.acessos);
                        
                        if (tentativas.desbloqueou > 0 || tentativas.acessos > 0) {
                            totalPaginasDesbloqueadas++;
                        }
                    }

                    const dadosDashboard = {
                        idVisitante: idVisitante,
                        visitorID: visitorID,
                        acertos: acertos,
                        totalPerguntas: total,
                        porcentagemAcerto: porcentagemAcerto,
                        totalErros: totalErros,
                        totalPaginasAcessadas: progTentativa.length,
                        totalPaginasDesbloqueadas: totalPaginasDesbloqueadas,
                        paginas: paginas,
                        acessos: acessos,
                        progresso: progTentativa
                    };

                    res.status(200).json(dadosDashboard);
                })
                // tratamento de erros daqui pra baixo
                .catch(error => {
                    console.error("Erro ao buscar dados de Quiz e Progresso:", error);
                    res.status(500).json({ erro: "Erro interno do servidor ao buscar dados de Quiz/Progresso." });
                });
        })
        .catch(error => {
            console.error("Erro na fetchvisitante - VisitorID:", error);
            res.status(500).json({ erro: "Erro interno do servidor ao buscar dados do Visitante." });
        });
}
// Fim do bloco 

// apenas recebe o parametro e faz o encaminhamento para o fetch
function dadosVisitantePorId(req, res) {
    const idVisitante = req.params.idUsuario;
    fetchvisitante(idVisitante, res);
}

// Função importante que traz os valores do último visitante a fim de ser o que vai aparecer na minha dashboard
function dadosUltimoVisitante(req, res) {
    var instrucaoBuscarUltimo = `
        SELECT idvisitante
        FROM visitante
        ORDER BY idvisitante DESC
        LIMIT 1;
    `; // query para chamar o ultimo visitante cadastrado no DB

    // Tratar os eventuais erros
    database.executar(instrucaoBuscarUltimo)
        .then(result => {
            if (!result || result.length === 0) {
                return res.status(404).json({ erro: "Nenhum visitante encontrado" });
            }
            const idVisitante = result[0].idvisitante;
            fetchvisitante(idVisitante, res);
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