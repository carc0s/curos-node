//modelo de seguir
const { Schema, model } = require('mongoose');

const seguirShema = new Schema({
    id_usuario: {
        type: Schema.Types.ObjectId,
        ref: 'userVO',
        required: true
    },
    id_seguidor: {
        type: Schema.Types.ObjectId,
        ref: 'userVO',
        required: true
    },
    fechaSeguir: {
        type: Date,
        default: Date.now()
    }
});

//exportar modulo
module.exports = model('Seguir', seguirShema, 'seguir');