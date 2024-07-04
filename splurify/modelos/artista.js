const { Schema, model } = require('mongoose');


//modelo de artista 
const artistaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    image: {
        type: String,
        default: 'default.jpg'
    },
    fecha: {
        type: Date,
        default: Date.now,
        select: false
    }


});

//exportar modulo
module.exports = model('ArtistaVO', artistaSchema, 'artistas');