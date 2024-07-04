const jwt = require('jwt-simple');
const moment = require('moment');

//clave secreta para el token
const secreto = 'clave_secreta_curso';


//crear funcion para generar token
const createToken = (user) => {
   
    const payload = {
        _id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        nick: user.nick,
        rol: user.rol,
        imagen: user.imagen,

        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secreto);
};


module.exports = {
    createToken,
    secreto

};



