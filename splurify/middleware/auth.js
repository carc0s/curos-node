const jwt = require('jwt-simple');
const moment = require('moment');


//clave secreta para el token
const libjwt = require('../servicios/jwt');
const secreto = libjwt.secreto;


//crear funcion para generar token
exports.auth = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(403).send({ message: "La petición no tiene la cabecera de autenticación" });
    }



    //limpiar token y quitar comillas
    const token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        //decodificar token
        let payload = jwt.decode(token, secreto);
        
        //comprobar si el token ha expirado
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: "El token ha expirado" });
        }
          //adjuntar usuario identificado a la request
    req.user = payload;


    } catch (ex) {
        return res.status(404).send({ message: "El token no es válido" });
    }

  

    //pasar a la acción
    next();

}
