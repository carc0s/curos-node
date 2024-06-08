//modelo de articulo de blog
const { Schema, model } = require('mongoose');

//estructura de modelo
const ArticuloSchema = Schema({
    titulo: {
        type: String,
        required: true,
        
    },
    contenido: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: false,
        default: "jpg.jpg"
    },
    fecha: {
        type: Date,
        default: Date.now
    },
  /*  autor: {
        type: String,
        required: true
    }
*/
});
module.exports = model('Articulo', ArticuloSchema);