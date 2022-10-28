// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    nome: {
        type: String,
        default: "",
        unique: true,
        required: [true, "O nome do serviço não pode ser nulo"],
    },
    preco: {
        type: Number,
        default: 0,
        min: 0,
        required: [true, "O serviço precisa ter um preço"]
    },
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Servicos', schema, 'servicos')