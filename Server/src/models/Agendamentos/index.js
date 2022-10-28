// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    data: {
        type: String,
        default: "",
        required: [true, "O agendamento precisa de uma data"]
    },
    inicio: {
        type: Number,
        default: 0,
        required: [true, "O agendamento precisa ter um início estipulado"]
    },
    valor: {
        type: Number,
        default: 0,
        required: [true, "O agendamento precisa ter um valor"]
    },
    servico_nome: {
        type: String,
        default: "",
        required: [true, "O agendamento precisa ter um serviço (nome)"]
    },
    servico_id: {
        type: String,
        default: "",
        required: [true, "O agendamento precisa ter um serviço (_id)"]
    },
    cliente_nome: {
        type: String,
        default: "",
        required: [true, "O agendamento precisa ter um cliente (nome)"]
    },
    cliente_id: {
        type: String,
        default: "",
        required: [true, "O agendamento precisa ter um cliente (_id)"]
    },

}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Agendamentos', schema, 'agendamentos')