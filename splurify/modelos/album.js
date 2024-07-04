//modelo de album
const { Schema, model } = require('mongoose');

const albumchema = new Schema({
    idArtista: {
        type: Schema.Types.ObjectId,
        ref: 'ArtistaVO',
        required: [true, 'El id del artista es obligatorio']
    },
   nombre: {
       type: String,
       required: [true, 'El nombre es obligatorio']
   },
   descripcion: {
       type: String,
       required: [true, 'La descripcion es obligatoria']
   },
   fechaLanzamiento: {
         type: Date,
         required: [true, 'La fecha de lanzamiento es obligatoria']
    },
    creadoel: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        default: 'no-image.jpg'
    }


});
//exportar modulo
module.exports = model('AlbumVO', albumchema, 'albumes');
