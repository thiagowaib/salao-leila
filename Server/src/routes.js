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
const { novoServico, modificarServico, removerServico } = require('./controllers/ControllerServicos')
routes.post('/novoServico', AuthTokenAcesso, novoServico)
routes.put('/modificarServico', AuthTokenAcesso, modificarServico)
routes.delete('/removerServico', AuthTokenAcesso, removerServico)

/**
 * Endpoints referentes ao controlador de Agendamentos
 * (controllers/ControllerAgendamentos/index.js)
 */
const { agendar } = require('./controllers/ControllerAgendamentos')
routes.post('/agendar', AuthTokenAcesso, agendar)

// * Exportação das rotas para main.js
module.exports = routes