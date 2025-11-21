use triskelion;

describe quiz;	

create table visitante (
idvisitante int primary key auto_increment,
visitorID varchar(200) not null,
datacriacao datetime default current_timestamp
);

create table progresso_visitante (
idprogresso int primary key auto_increment, 
idvisitante int not null,
pagina varchar(50) not null,
desbloqueou int,
acessos int
);

create table usuario (
idusuario int primary key auto_increment,
visitorID  VARCHAR(200),
nome varchar(45),
senha varchar(45),
email varchar(45)
);

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
);


ALTER TABLE progresso_visitante ADD UNIQUE INDEX idx_visitante_pagina (idvisitante, pagina);

select * from progresso_visitante;

select * from visitante;

select * from usuario;
  
select * from quiz_resultado;

SELECT * FROM usuario;
