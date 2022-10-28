// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    nome: {
        type: String,
        default: "",
        required: [true, "O nome do admin não pode ser nulo"],
    },
    email: {
        type: String,
        default: "",
        required: [true, "O email do admin não pode ser nulo"],
    },
    senha: {
        type: String,
        default: "",
        required: [true, "A senha do admin não pode ser nula"]
    }
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Admins', schema, 'admins')