// DAOuser.js

const usuarios = require('../modelos/userVO');
const bcrypt = require('bcrypt');
const jwt = require('../servicios/jwt');
const mongoose = require('mongoose-pagination');
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
  try {
    const params = req.body;

    if (!params.email || !params.password) {
      return res.status(400).json({
        status: "error",
        message: "Datos incompletos",
      });
    }

    const existeemail = await usuarios.findOne({ email: params.email.toLowerCase() });

    if (!existeemail) {
      return res.status(400).json({
        status: "error",
        message: "Email o contraseña incorrectos",
      });
    }

    const passwordMatch = await bcrypt.compare(params.password, existeemail.password);
    if (!passwordMatch) {
      return res.status(400).json({
        status: "error",
        message: "Email o contraseña incorrectos",
      });
    }
    //conseguir token
    const token = jwt.createToken(existeemail);


    return res.status(200).json({
      status: "success",
      message: "Usuario logueado",
      usuario: existeemail,
      token: token,

    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error del servidor",
      error: error.message,
    });
  }
};
const perfil = async (req, res) => {
  try {
    // Obtener usuario autenticado
    const id = req.params.id;

    // Validar que se ha proporcionado un ID
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "ID de usuario es requerido",
      });
    }

    // Buscar usuario en la base de datos
    const usuario = await usuarios.findById(id).select('-password -rol');

    // Verificar si el usuario ya existe
    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario logueado",
      usuario,
    });
  } catch (error) {
    console.error(error); // Log del error para depuración
    return res.status(500).json({
      status: "error",
      message: "Error del servidor",
      error: error.message,
    });
  }
}

//paginacion de usuarios
const paginacion = async (req, res) => {
  try {
    // Obtener la página actual de los parámetros de la ruta
    const page = req.params.page ? parseInt(req.params.page, 10) : 1;
    const perPage = 5;

    // Obtener el total de documentos en la colección de usuarios
    const total = await usuarios.countDocuments();

    // Obtener los usuarios para la página actual
    const userDocs = await usuarios.find({})
      .sort('id')
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (!userDocs) {
      return res.status(404).json({
      status: "error",
      message: "Error al obtener usuarios",
      });
    }
    // Enviar la respuesta con los datos paginados
    return res.status(200).json({
      status: "success",
      message: "Usuarios obtenidos correctamente",
      usuarios: userDocs,
      totalUsers: total,
      totalPages: Math.ceil(total / perPage),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error del servidor",
      error: error.message,
    });
  }
};

// Exportar funciones
module.exports = {
  getUsers,
  registrarusu,
  login,
  perfil,
  paginacion
};



