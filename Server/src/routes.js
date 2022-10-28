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


// * Exportação das rotas para main.js
module.exports = routes