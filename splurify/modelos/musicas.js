//modelo de album
const { Schema, model } = require('mongoose');

const musicaSchema = new Schema({
    idAlbum: {
        type: Schema.Types.ObjectId,
        ref: 'AlbumVO',
        required: [true, 'El id del artista es obligatorio']
    },
    numeroCancion: {
        type: Number,
        required: [true, 'El numero de la cancion es obligatorio']
    },
   nombre: {
       type: String,
       required: [true, 'El nombre es obligatorio']
   },
   duracion: {
       type: String,
       required: [true, 'La descripcion es obligatoria']
   },
   archivo: {
         type: String,
        default: 'default.mp3'
    },
    creadoel: {
        type: Date,
        default: Date.now
    }


});
//exportar modulo
module.exports = model('MusicaVo', musicaSchema, 'musicas');
