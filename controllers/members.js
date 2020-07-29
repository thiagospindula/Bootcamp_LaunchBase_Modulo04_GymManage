//guarda os dados do req.body em um json externo
const fs = require('fs')
//chamando o arquivo data que irá receber dados do cadastro
const data = require('../data.json')
//extenção para mostrar data pt-BR
const Intl = require('intl')
//chamando função que irá calcular idade
const { date } = require('../utils')
//função para mostrar dados do instrutor em tela

exports.index = function(req, res) {
  return res.render("members/index", { members: data.members })
}

exports.show = function(req, res) {
  //retirando de dentro do req.params a id e fazendo que ela vire uma variável
  const { id } = req.params
  //cada vez que encontrar um instrutor dentro do array de instrutores, vai rodar uma função mostrando o instrutor do momento.
  const foundMember = data.members.find(function(member){
    return member.id == id
  })

  if (!foundMember) return res.send("Instrutor não encontrado")

  
  const member = {
    ...foundMember,
    birth: date(foundMember.birth).birthDay
    //transformando uma string em array, cria uma posição sempre que tiver ","
  }

  return res.render("members/show", { member })
}

exports.create = function(req, res) {
  return res.render('members/create')
}

//função para o create(post)
exports.post = function(req, res){
  //req.body para receber dados POST
  //req.query para receber dados/pedido get
  const keys = Object.keys(req.body)
  //Object = uma função que irá retornar um objeto
  for(key of keys) {
    //mesmo que req.body.avatar_url ou .instrutor
    if (req.body[key] == "")
      return res.send('Por favor, preencha todos os campos')
      //se tiver somente uma linha de retorno na estrutura IF não precisa de chaves
  }
  //transforma a data e joga p o mesmo lugar
  birth = Date.parse(req.body.birth)
  //adicionando uma id para identificar arrays
  let id = 1
  const lastMember = data.members[data.members.length - 1]
  //adicionando um no Id para não repetir nenhum id saldo
  //somente para a primeira vez que o id for salvo
  if (lastMember) {
    id = lastMember.id + 1
  }
  //variável data é um objeto|criado uma chave members no formato array
  //push: uma funcionalidade para adicionar algo em array
  data.members.push({
    id,
    ...req.body,
    birth
  })
  //escrevendo o arquivo | (caminho do arquivo a ser criado, tipo de objeto no caso JSON(o que o stringfy vai transformar em JSON?neste caso req.bory), callback function útil para não travar o aplicativo, é uma função que passa dentro de outra função, neste caso irá retornar erro "err"),
  //null: tipo de dado vazio, quando se quer pular a orgem de configuração
  //2: quebrar a linha e colocar dois espaços na criação do arquivo dados array
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    //se tiver erro retornar msg ()
    if (err) return res.send("File error")

    return res.redirect("/members")
  })
}

//edit
exports.edit = function(req, res){
  //retirando de dentro do req.params a id e fazendo que ela vire uma variável
  const { id } = req.params
  //cada vez que encontrar um instrutor dentro do array de instrutores, vai rodar uma função mostrando o instrutor do momento.
  const foundMember = data.members.find(function(member) {
    return member.id == id
  })

  if (!foundMember) return res.send("Instrutor não encontrado")

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).iso
  }

  return res.render('members/edit', { member })
}

// put
exports.put = function(req, res) {
  const { id } = req.body
  let index = 0

  const foundMember = data.members.find(function(member, foundIndex) {
    if (id == member.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundMember) return res.send("Instrutor não encontrado")

  const member = {
    ...foundMember,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)

  }

  data.members[index] = member

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("File error")

    return res.redirect(`/members/${id}`)
  })
}

// delete
exports.delete = function(req, res) {
  const { id } = req.body

  const filteredMembers = data.members.filter(function(member){
    return member.id != id
  })

  data.members = filteredMembers

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
    if (err) return res.send("File error!")

    return res.redirect("/members")
  })
}