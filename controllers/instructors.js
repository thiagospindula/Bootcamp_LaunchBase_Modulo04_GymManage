//guarda os dados do req.body em um json externo
const fs = require('fs')
//chamando o arquivo data que irá receber dados do cadastro
const data = require('../data.json')
//extenção para mostrar data pt-BR
const Intl = require('intl')
//chamando função que irá calcular idade
const { age, date } = require('../utils')
//função para mostrar dados do instrutor em tela

exports.index = function(req, res) {
  return res.render("instructors/index", { instructors: data.instructors })
}

exports.show = function(req, res) {
  //retirando de dentro do req.params a id e fazendo que ela vire uma variável
  const { id } = req.params
  //cada vez que encontrar um instrutor dentro do array de instrutores, vai rodar uma função mostrando o instrutor do momento.
  const foundInstructor = data.instructors.find(function(instructor){
    return instructor.id == id
  })

  if (!foundInstructor) return res.send("Instrutor não encontrado")

  
  const instructor = {
    ...foundInstructor,
    age: age(foundInstructor.birth),
    //transformando uma string em array, cria uma posição sempre que tiver ","
    services: foundInstructor.services.split(","),
    created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at),
  }

  return res.render("instructors/show", { instructor })
}

exports.create = function(req, res){
  return res.render('instructors/create')
}

// create
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
  //organizando exatamento os dados que quero enviar para data.json
  let { avatar_url, name, birth, gender, services} = req.body
  //transforma a data e joga p o mesmo lugar
  birth = Date.parse(birth)
  //Date.now: método que cria uma data do cadastro de dados
  const created_at = Date.now()
  //adicionando uma id para identificar arrays
  const id = Number(data.instructors.length + 1)
  //variável data é um objeto|criado uma chave instructors no formato array
  //push: uma funcionalidade para adicionar algo em array
  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at,
  })
  //escrevendo o arquivo | (caminho do arquivo a ser criado, tipo de objeto no caso JSON(o que o stringfy vai transformar em JSON?neste caso req.bory), callback function útil para não travar o aplicativo, é uma função que passa dentro de outra função, neste caso irá retornar erro "err"),
  //null: tipo de dado vazio, quando se quer pular a orgem de configuração
  //2: quebrar a linha e colocar dois espaços na criação do arquivo dados array
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    //se tiver erro retornar msg ()
    if (err) return res.send("File error")

    return res.redirect("/instructors")
  })
}

exports.edit = function(req, res){
  //retirando de dentro do req.params a id e fazendo que ela vire uma variável
  const { id } = req.params
  //cada vez que encontrar um instrutor dentro do array de instrutores, vai rodar uma função mostrando o instrutor do momento.
  const foundInstructor = data.instructors.find(function(instructor) {
    return instructor.id == id
  })

  if (!foundInstructor) return res.send("Instrutor não encontrado")

  const instructor = {
    ...foundInstructor,
    //.iso estrutura usada em utils.js
    birth: date(foundInstructor.birth).iso
  }

  return res.render('instructors/edit', { instructor })
}

exports.put = function(req, res) {
  const { id } = req.body
  let index = 0

  const foundInstructor = data.instructors.find(function(instructor, foundIndex) {
    if (id == instructor.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundInstructor) return res.send("Instrutor não encontrado")

  const instructor = {
    ...foundInstructor,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)

  }

  data.instructors[index] = instructor

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("File error")

    return res.redirect(`/instructors/${id}`)
  })
}

exports.delete = function(req, res) {
  const { id } = req.body

  const filteredInstructors = data.instructors.filter(function(instructor){
    return instructor.id != id
  })

  data.instructors = filteredInstructors

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
    if (err) return res.send("File error!")

    return res.redirect("/instructors")
  })
}