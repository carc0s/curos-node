const validator = require('validator');

const validarDatos = (parametros) => {
    try {
        let validartitulo = !validator.isEmpty(parametros.titulo) && validator.isLength(parametros.titulo, { min: 5 });
        let validarcontenido = !validator.isEmpty(parametros.contenido);

        if (!validartitulo || !validarcontenido) {
            return "No se han validado los datos";
        }
    } catch (error) {
        return error.message;
    }

    return null;
};

module.exports = {
    validarDatos
};