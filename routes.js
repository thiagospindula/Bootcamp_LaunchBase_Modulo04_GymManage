const express = require('express')
//express serve o método "Router" que é capaz de fazer a variavél routes seja responsável pelas rodas.
const routes = express.Router()
//chamando o arquivo instructors.js para usar POST
const instructors = require('./controllers/instructors')
const members = require('./controllers/members')

routes.get('/', function(req, res) {
  return res.redirect("/instructors")
})

routes.get('/instructors', instructors.index)
routes.get('/instructors/create', instructors.create)
//criando rota para id de instructors
routes.get('/instructors/:id', instructors.show)
//rota para arquivo de edição do cadastro de instrutor
routes.get('/instructors/:id/edit', instructors.edit)
//chamando o arquivo instructors.js para usar POST
routes.post("/instructors", instructors.post)
routes.put("/instructors", instructors.put)
//HTTP VRBS
//GET: Receber RESOURCE
//POST: Criar um NOVO RESOURCE com dados enviados
//PUT: Atualizar RESOURCE
//DELETE: Deletar RESOURCE
routes.delete("/instructors", instructors.delete)


routes.get('/members', members.index)
routes.get('/members/create', members.create)
//criando rota para id de members
routes.get('/members/:id', members.show)
//rota para arquivo de edição do cadastro de instrutor
routes.get('/members/:id/edit', members.edit)
//chamando o arquivo members.js para usar POST
routes.post("/members", members.post)
routes.put("/members", members.put)
//HTTP VRBS
//GET: Receber RESOURCE
//POST: Criar um NOVO RESOURCE com dados enviados
//PUT: Atualizar RESOURCE
//DELETE: Deletar RESOURCE
routes.delete("/members", members.delete)

module.exports = routes