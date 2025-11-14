var database = require("../database/config")

function listar() {
    var instrucaoSql = `
  select fkUsuario as 'ID do Usuário', truncate(avg(aproveitamento),2) as Aproveitamento, Usuário.nome as 'Nome' from Quiz join Usuário on fkUsuario = idUsuario group by fkUsuario order by Aproveitamento desc limit 5;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function buscar() {
    var instrucaoSql = `
select Usuário.nome as 'Nome', avg(QtdAcertos) as 'QtdAcertos' from quiz join Usuário on fkUsuario = idUsuario group by idUsuario; 
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(Usuario, Aproveitamento, QtdAcertos) {
    var instrucaoSql = `
        INSERT INTO quiz (fkUsuario, Aproveitamento, QtdAcertos) VALUES (${Usuario}, ${Aproveitamento} , ${QtdAcertos});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function opinar(Usuario, avaliação) {
    var instrucaoSql = `
    insert into opiniões (fkUsuário, Opinião) values ('${Usuario}', '${avaliação}')
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