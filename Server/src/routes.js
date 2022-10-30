// * Importações das bibliotecas
const express = require('express')
const routes = new express.Router()


// * Importação de Middlewares
/**
 * O AuthTokenAcesso é um Middleware
 * (executado entre chamada e controlador)
 * que verifica a autenticidade do Token de Acesso JWT
 * informado no header "auth".
 */
const {AuthTokenAcesso} = require('./middlewares')

// * Definição dos endpoints
/**
 * Endpoints referentes ao controlador de Admins
 * (controllers/ControllerAdmins/index.js)
 */
const { novoAdmin, loginAdmin } = require('./controllers/ControllerAdmins')
routes.post('/novoAdmin', novoAdmin)
routes.post('/loginAdmin', loginAdmin)

/**
 * Endpoints referentes ao controlador de Clientes
 * (controllers/ControllerClientes/index.js)
 */
const { novoCliente, loginCliente, removerCliente } = require('./controllers/ControllerClientes')
routes.post('/novoCliente', novoCliente)
routes.post('/loginCliente', loginCliente)
routes.delete('/removerCliente', AuthTokenAcesso, removerCliente)

/**
 * Endpoints referentes ao controlador de Serviços
 * (controllers/ControllerServicos/index.js)
 */
const { novoServico, buscarServicos, modificarServico, removerServico } = require('./controllers/ControllerServicos')
routes.post('/novoServico', AuthTokenAcesso, novoServico)
routes.get('/buscarServicos', AuthTokenAcesso, buscarServicos)
routes.put('/modificarServico', AuthTokenAcesso, modificarServico)
routes.delete('/removerServico', AuthTokenAcesso, removerServico)

/**
 * Endpoints referentes ao controlador de Agendamentos
 * (controllers/ControllerAgendamentos/index.js)
 */
const { agendar, buscarAgendamentos, cancelarAgendamentoPorId, buscarDatasAgendadas } = require('./controllers/ControllerAgendamentos')
routes.post('/agendar', AuthTokenAcesso, agendar)
routes.get('/buscarAgendamentos', AuthTokenAcesso, buscarAgendamentos)
routes.delete('/cancelarAgendamento/:id', AuthTokenAcesso, cancelarAgendamentoPorId)
routes.get('/buscarDatasAgendadas/', AuthTokenAcesso, buscarDatasAgendadas)

/**
 * Endpoints referentes ao controlador de Usuários
 * (controllers/ControllerUsuarios/index.js)
 */
const {authJWT} = require('./controllers/ControllerUsuarios')
routes.get('/authJWT', AuthTokenAcesso, authJWT)

// * Exportação das rotas para main.js
module.exports = routes