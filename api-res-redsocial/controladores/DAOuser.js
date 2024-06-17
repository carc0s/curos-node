// DAOuser.js

const usuarios = require('../modelos/userVO');
const bcrypt = require('bcrypt');

const getUsers = (req, res) => {
    return res.status(200).json([
        {
            user: "Obtener usuarios",
            autor: "Jhonny",
            url: "https://www.udemy.com/course/curso-de-node-js/",
        },
        {
            user: "Obtener un usuario",
            autor: "Jhonny",
            url: "https://www.udemy.com/course/curso-de-node-js/",
        },
    ]);
};

// Registrar usuario

const registrarusu = async (req, res) => {
    // Recoger datos de la petición
    let params = req.body;

    // Validar datos
    if (!params.nombre || !params.email || !params.password || !params.nick) {
        return res.status(400).json({
            status: "error",
            message: "Datos incompletos",
        });
    }

    try {
        // Verificar si el usuario ya existe
        let existingUser = await usuarios.findOne({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "Usuario ya registrado",
            });
        }

        // Cifrar contraseña
        const hashedPassword = await bcrypt.hash(params.password, 10);
        params.password = hashedPassword;

        // Crear nuevo usuario
        let nuevoUsuario = new usuarios(params);

        // Guardar usuario en la base de datos
        await nuevoUsuario.save();

        return res.status(200).json({
            status: "success",
            message: "Usuario registrado exitosamente",
            usuario: nuevoUsuario,
        });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};
//iniciar sesion
const login = async (req, res) => {
    //recoger parametros de la peticion
    const params = req.body;
  
    //validar datos
    if (!params.email || !params.password) {
      return res.status(400).json({
        status: "error",
        message: "Datos incompletos",
      });
    }
  
    //buscar si el usuario existe
    const existeemail = await usuarios.findOne(
      { email: params.email.toLowerCase() }
    );
  
    if (!existeemail) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no registrado",
      });
    }
  
    //comprobar si la contraseña es correcta
    const passwordMatch = bcrypt.compareSync( params.password,usuarios.password);
    if (!passwordMatch) {
      return res.status(400).json({
        status: "error",
        message: "Contraseña incorrecta",
      });
    }
    //generar token de jwt
    //devolver respuesta
    return res.status(200).json({
      status: "success",
      message: "Usuario logueado",
      usuario: existeemail,
    });
  }

// Exportar funciones
module.exports = {
    getUsers,
    registrarusu,
    login,
};



