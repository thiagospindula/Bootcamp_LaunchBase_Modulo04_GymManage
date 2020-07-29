const express = require('express')
//nunjucks possibilita re-uso de código
const nunjucks = require('nunjucks')
const routes = require("./routes")
//override para usar verb PUT
const methodOverride = require('method-override')

const server = express()
//middlewares = intercepta pontoA ao pontoB (colocando parametros entre o chamado do servidor <=> endereçoWeb)
//responsável por fazer funcionar o req Body (recebimento do formulário)
server.use(express.urlencoded({ extended: true}))
server.use(express.static('public'))
//sobreescreve o method para depois entrar na rota. Por isso methodOverride precisa ser configurado primeiro.
server.use(methodOverride('_method'))
server.use(routes)

//setando motor de view que irá usar neste caso njk
server.set("view engine", "njk")

//configurando caminho para nunjucks
nunjucks.configure("views", {
  express: server,
  //configura nunjks para não segurar codigo html.
  autoescape: false,
  //servidor guarda cache de informações antigas impossibilitando a visualização de algumas alterações.
  noCache: true
})

server.listen(5000, function() {
  console.log("server is running")
})