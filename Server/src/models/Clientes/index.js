// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    nome: {
        type: String,
        default: "",
        required: [true, "O nome do cliente não pode ser nulo"],
    },
    email: {
        type: String,
        default: "",
        required: [true, "O email do cliente não pode ser nulo"],
    },
    senha: {
        type: String,
        default: "",
        required: [true, "A senha do cliente não pode ser nula"]
    },
    agendamentos: [{
        type: String,
        default: null
    }]
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Clientes', schema, 'clientes')