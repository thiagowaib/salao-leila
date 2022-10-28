// * Importações das bibliotecas
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')


// * Configuração para o uso do arquivo de ambiente (.env)
require('dotenv').config({path: __dirname + "/../.dsin.env"})


// * Função de inicialização do servidor
const initServer = () => {
    const app = express()

    // Conexão com o BD
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
    })

    /**
     *  • Utilização de CORS para comunicação
     *    entre protocólos HTTP e HTTPS
     *  • Utilização de JSON como formatação
     *    de dados nos métodos e endpoints
     */
    app.use(express.json())
    app.use(cors())

    app.use(express.static('public'))

    // Conexão com os endpoints em ./routes.js
    app.use(require('./routes'))

    /**
     * Inicialização do servidor na porta informada
     * pelo arquivo de ambiente (.dsin.env) {SERVER_PORT}
     * com feedback de confirmação
     */
    const server = require('http').Server(app)
    server.listen(process.env.SERVER_PORT, () => {
        console.log(`Servidor online em http://localhost:${process.env.SERVER_PORT}/`)
    })
}


// * Inicialização do servidor
initServer()