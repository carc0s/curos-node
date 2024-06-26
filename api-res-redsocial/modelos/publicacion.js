const { text } = require('express');
const { Schema, model } = require('mongoose');
//modelo de publicacion

const publicacionSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'UserVO'
     },
     texto: {
        type: String,
        required: true
    },
    archivo: {
        type: String,
        required: false
    },
    fecha: {
        type: Date,
        default: Date.now
    },

});


module.exports = model('Publicacion', publicacionSchema , 'publicaciones');