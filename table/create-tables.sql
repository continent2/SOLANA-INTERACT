
create database solint ;
create user 'meme'@'localhost' identified by '5ZXUBRZ6BX2FHL5RE89X' ;
grant all privileges on solint.* to 'meme'@'localhost' ;
flush privileges ;

create table `pool` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `createdat` datetime DEFAULT current_timestamp(),
  `updatedat` datetime DEFAULT NULL ON UPDATE current_timestamp(),
	pooladdress varchar(80) ,
	base varchar(80) ,
	quote varchar(80) ,
	initbaseamount varchar(30),
	initquoteamount varchar(30),
	authority varchar(80)	,
	txhash text ,
	primary key (id)
) ;
CREATE TABLE `token` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `createdat` datetime DEFAULT current_timestamp(),
  `updatedat` datetime DEFAULT NULL ON UPDATE current_timestamp(),
	address varchar(80) ,
	privatekey varchar( 120 ) ,
	name varchar(50) ,
	symbol varchar(50) ,
	urllogo varchar(200) ,
	primary key (id)
);
