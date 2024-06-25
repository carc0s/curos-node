//modelo de usuario
const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellidos: {
        type: String,

    },
    bio:{
        type: String,
        default: 'Bienvenido a mi perfil'
    },
    nick: {
        type: String,
        required: [true, 'El nick es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    rol: {
        type: String,
        default: 'USER'
    },
    image: {
        type: String,
        default: 'default.jpg'
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});
//exportar modulo
module.exports = model('UserVO', usuarioSchema, 'users');