create database triskelion;
use triskelion;

	create table visitante (
	idvisitante int primary key auto_increment,
	visitorID varchar(200) not null unique,
	senha varchar(50),
	datacriacao datetime default current_timestamp
	);

	create table progresso_visitante (
	idprogresso int primary key auto_increment, 
	-- CORREÇÃO: idvisitante deve ser INT e NOT NULL
	idvisitante INT NOT NULL, 
	pagina varchar(50) not null,
	desbloqueou int,
	acessos int
	-- Opcional: Adicionar a Foreign Key
    -- FOREIGN KEY (idvisitante) REFERENCES visitante(idvisitante)
	);

	create table usuario (
	idusuario int primary key auto_increment,
	nome varchar(300),
	senha varchar(45),
	email varchar(300)
	);
	
    insert into usuario (nome, senha, email) values
		('Ricardo', '12345678', 'gmail@gmail.com');

	create table quiz (
	id int primary key auto_increment,
	pergunta varchar(300) not null,
	imagem varchar (200),
	alternativaA varchar (200),
	alternativaB varchar (200),
	alternativaC varchar (200),
	alternativaD varchar (200),
	alternativaCorreta varchar (200)
	);

	CREATE TABLE quiz_resultado (
	  idresultado INT PRIMARY KEY AUTO_INCREMENT,
	  idvisitante INT NOT NULL, 
	  acertos INT,
	  totalPerguntas INT,
	  datacriacao DATETIME DEFAULT CURRENT_TIMESTAMP
	  -- Opcional: Adicionar a Foreign Key
      -- FOREIGN KEY (idvisitante) REFERENCES visitante(idvisitante)
	);

	insert into quiz (pergunta, imagem, alternativaA, alternativaB, alternativaC, alternativaD, alternativaCorreta) values
		('Qual é o nome do simbolo abaixo?', './assets/imgs/triskle.png', 'Triskle', 'Triqueta', 'Cruz Celta', 'Árvore da vida', 'alternativaA'),
		('Qual é o nome do simbolo abaixo?', './assets/imgs/Triqueta.png', 'Triskle', 'Triqueta', 'Cruz Celta', 'Árvore da vida', 'alternativaB'),
		('Qual é o nome do simbolo abaixo?', './assets/imgs/Crann Bethadh.png', 'Triskle', 'Triqueta', 'Cruz Celta', 'Árvore da vida', 'alternativaD'),
		('Qual é o nome do simbolo abaixo?', './assets/imgs/cruz-celta.png', 'Triskle', 'Triqueta', 'Cruz Celta', 'Árvore da vida', 'alternativaC'),
		('Qual é o nome do simbolo que representa presente, passado e futuro?', null, 'Triskle', 'Triqueta', 'Cruz Celta', 'Árvore da vida', 'alternativaA'),
		('Quais os principais ingredientes do hidromel?', '/assets/imgs/hidromel.png', 'Mel, água e leveduras', 'Mel, água e álcool', 'água, açúcar e álcool', 'água, mel e açúcar', 'alternativaA'),
		('Quais os principais ingredientes bolo de maçã celta?', './assets/imgs/bolo.jfif', 'maçã, ovo, leite e farinha', 'farinha, aveia e maçã', 'maçã, aveia, farinha e ovo', 'aveia, farinha, maçã e mel', 'alternativaD'),
		('Quais os principais ingredientes bannock?', './assets/imgs/bannock.jfif', 'aveia, gordura e ovo', 'farinha, aveia e ovo', 'aveia, farinha de cevada e agua', 'agua e farinha de cevada', 'alternativaC'),
		('O que compunha a alimentação celta?', null, 'grãos, carnes e pescados', 'grãos, fungos, mel, leite e pescados', 'grãos, leite e ervas', 'grãos, caça e frutas', 'alternativaB');

	select * from progresso_visitante;

	select * from visitante;

	select * from usuario;
	  
	select * from quiz_resultado;	

	SELECT * FROM usuario;
            
	 alter view vw_progresso_visitante as
select
    visitante.visitorID as 'Identificação do visitante',
    SUM(progresso_visitante.acessos) as 'Paginas desbloqueadas',
    visitante.datacriacao as 'Data do primeiro acesso'
from
    visitante
join   
	progresso_visitante on visitante.idvisitante = progresso_visitante.idvisitante
group by   
	visitante.visitorID,
    visitante.datacriacao
order by
    visitante.datacriacao desc;
    
    select * from vw_progresso_visitante;
    
alter view vw_resultado_quiz as
select
    visitante.visitorID as 'Identificação do visitante',
    SUM(quiz_resultado.acertos) as 'Total de acertos',
    SUM(quiz_resultado.totalPerguntas) as 'Total de perguntas',
    SUM(quiz_resultado.totalPerguntas) - SUM(quiz_resultado.acertos) as 'Erros',
    if(SUM(quiz_resultado.totalPerguntas) is null or SUM(quiz_resultado.totalPerguntas) = 0, null, 
       format((SUM(quiz_resultado.acertos) / SUM(quiz_resultado.totalPerguntas)) * 100, 2)) as 'Porcentagem de acertos'
from
    visitante 
join
    quiz_resultado on visitante.idvisitante = quiz_resultado.idvisitante
group by
    visitante.visitorID
order by
    'Porcentagem de acertos' desc;
    
    select * from vw_resultado_quiz;
    