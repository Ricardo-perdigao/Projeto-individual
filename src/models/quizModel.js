var database = require("../database/config")

function listar() {
    var instrucaoSql = `
  select idvisitante as 'ID do Usuario', truncate(avg(aproveitamento),2) as Aproveitamento, Usuario.nome as 'Nome' from Quiz join Usuario on idvisitante = idUsuario group by idvisitante order by Aproveitamento desc limit 5;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function buscar() {
    var instrucaoSql = `
select Usuario.nome as 'Nome', avg(QtdAcertos) as 'QtdAcertos' from quiz join Usuario on idvisitante = idUsuario group by idUsuario; 
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(Usuario, Aproveitamento, QtdAcertos) {
    var instrucaoSql = `
        INSERT INTO quiz (idvisitante, Aproveitamento, QtdAcertos) VALUES (${Usuario}, ${Aproveitamento} , ${QtdAcertos});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function opinar(Usuario, avaliação) {
    var instrucaoSql = `
    insert into opiniões (idvisitante, Opinião) values ('${Usuario}', '${avaliação}')
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    listar,
    opinar,
    buscar
};