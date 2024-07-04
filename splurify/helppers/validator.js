const validator = require('validator');

const validate = (params) => {
    let nombre = params.nombre;
    let apellido = params.apellido;
    let nick = params.nick;
    let email = params.email;
    let password = params.password;
   



    if (validator.isEmpty(nombre) || !validator.isLength(nombre, { min: 2, max: 30 }) || !validator.isAlpha(nombre, "es-ES")) {

        throw new Error("El nombre debe tener entre 2 y 30 caracteres y solo puede contener letras");
    }
    if (validator.isEmpty(apellido) || !validator.isLength(apellido, { min: 2, max: 30 }) || !validator.isAlpha(apellido, "es-ES")) {

        throw new Error("El nombre debe tener entre 2 y 30 caracteres y solo puede contener letras");
    }

    
    if (!validator.isLength(nick, { min: 2, max: 30 }) || validator.isEmpty(nick) || !validator.isAlpha(nick, "es-ES")) {
        
        throw new Error("El nick debe tener al menos 2 caracteres");
        
    }

    if (!validator.isEmail(email)) {
        throw new Error("El email no es válido");
    }

    if (!validator.isLength(password, { min: 3 })) {
       throw new Error("La contraseña debe tener al menos 6 caracteres");
    }



    // Additional validations can be added here

    return null; // Return null if all validations pass
}



module.exports = { validate };  