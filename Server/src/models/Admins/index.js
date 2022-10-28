// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    usuario: {
        type: String,
        default: "",
        unique: true,
        required: [true, "O username do admin não pode ser nulo"],
    },
    senha: {
        type: String,
        default: "",
        required: [true, "A senha do admin não pode ser nula"]
    }
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Admins', schema, 'admins')