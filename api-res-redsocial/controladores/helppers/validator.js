const validator = require('validator');

const validate = (params) => {
    let nombre = params.nombre;
    let nick = params.nick;
    let email = params.email;
    let password = params.password;
    let bio = params.bio;



    if (validator.isEmpty(nombre) || !validator.isLength(nombre, { min: 2, max: 30 }) || !validator.isAlpha(nombre, "es-ES")) {

        throw new Error("El nombre debe tener entre 2 y 30 caracteres y solo puede contener letras");
    }

    
    if (!validator.isLength(nick, { min: 2, max: 30 }) || validator.isEmpty(nick) || !validator.isAlpha(nick, "es-ES")) {
        
        throw new Error("El nick debe tener al menos 2 caracteres");
        
    }

    if (!validator.isEmail(email)) {
        throw new Error("El email no es válido");
    }

    if (!validator.isLength(password, { min: 6 })) {
       throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    if (!validator.isLength(bio, { max: 160 })) {
        throw new Error("La biografía no puede tener más de 160 caracteres  ");
    }

    // Additional validations can be added here

    return null; // Return null if all validations pass
}



module.exports = { validate };  