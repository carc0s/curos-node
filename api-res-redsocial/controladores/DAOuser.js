// DAOuser.js
const fs = require("fs");
const usuarios = require('../modelos/userVO');
const bcrypt = require('bcrypt');
const jwt = require('../servicios/jwt');
const mongoose = require('mongoose-pagination');
const path = require("path");
const servivcioseguir = require('../servicios/seuidosId');
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

//perfil de usuario

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
    const info = await servivcioseguir.seguido(req.user._id, id);
    return res.status(200).json({
      status: "success",
      message: "Usuario logueado",
      usuario,
      seguidos: info.seguidos,
      seguidores: info.seguidores,
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
    let idseguidos = await servivcioseguir.seguirid(req.user._id);
    // Enviar la respuesta con los datos paginados
    return res.status(200).json({
      status: "success",
      message: "Usuarios obtenidos correctamente",
      usuarios: userDocs,
      datosS_de_siguiendo: idseguidos.seguidores,
      datos_de_seguidos: idseguidos.seguidos,
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

//actulizar datos de ususarios
const update = async (req, res) => {
  try {
    // Obtener el ID del usuario autenticado
    const userId = req.user;

    // Obtener los datos del formulario
    const params = req.body;

    // Verificar si el email o nick ya están en uso por otro usuario, excluyendo al usuario actual
    let existingUsers = await usuarios.find({
      $or: [
        { email: { $regex: new RegExp(`^${params.email}$`, 'i') } },
        { nick: { $regex: new RegExp(`^${params.nick}$`, 'i') } }
      ],
      _id: { $ne: userId } // Excluir el usuario actual
    });

    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Email o nick ya registrado",
      });
    }

    // Cifrar contraseña si se proporciona una nueva
    if (params.password) {
      const hashedPassword = await bcrypt.hash(params.password, 10);
      params.password = hashedPassword;
    }

    // Actualizar los datos del usuario
    const usuarioActualizado = await usuarios.findByIdAndUpdate(userId, params, { new: true });

    if (usuarioActualizado) {
      return res.status(200).json({
        status: "success",
        message: "Usuario actualizado correctamente",
        usuario: usuarioActualizado,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error del servidor",
      error: error.message,
    });
  }
};

//subir imagen
const subirImagen = async (req, res) => {
  // Recoger el fichero de la imagen
  if (!req.file || req.file == undefined) {
    return res.status(400).json({
      mensaje: "sin imagen"
    });
  }

  // Nombre del archivo
  let nombrearchivo = req.file.originalname;

  // Extensión del archivo
  let extencion = nombrearchivo.split("\.");
  let archivoextencion = extencion[1].toLowerCase(); // Convertir la extensión a minúsculas para evitar problemas de validación

  // Comprobar extensión del archivo
  if (archivoextencion != "png" && archivoextencion != "jpg" && archivoextencion != "jpeg" && archivoextencion != "gif") {
    // Borrar archivo
    fs.unlink(req.file.path, (error) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al eliminar el archivo no válido",
          error
        });
      }
      return res.status(400).json({
        mensaje: "extencion no valida"
      });
    });
  } else {
    try {
      // Obtener el ID del artículo desde los parámetros de la solicitud
      let id = req.params.id;

      // Buscar y actualizar el artículo
      let foto = await usuarios.findByIdAndUpdate(req.user._id, { image: req.file.filename }, { new: true });

      if (!foto) {
        // Borrar el archivo si el artículo no se encuentra
        fs.unlink(req.file.path, (error) => {
          return res.status(404).json({
            mensaje: "No se encontró el artículo"
          });
        });
      } else {
        return res.status(200).json({
          status: "success",
          mensaje: "Imagen subida y artículo actualizado correctamente",


        });
      }
    } catch (error) {
      // Borrar el archivo en caso de error
      fs.unlink(req.file.path, (err) => {
        return res.status(500).json({
          mensaje: "Error al modificar el artículo",
          error
        });
      });
    }
  }
};

// Obtener imagen
const buscarImagen = (req, res) => {
  let archivo = req.params.file;
  console.log(archivo);
  let rutaarchivo = "./imagenes/fotoperfil/" + archivo;

  fs.access(rutaarchivo, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({
        mensaje: "imagen no encontrada"
      });
    } else {
      return res.sendFile(path.resolve(rutaarchivo));
    }
  });
};


// Exportar funciones
module.exports = {
  getUsers,
  registrarusu,
  login,
  perfil,
  paginacion,
  update,
  subirImagen,
  buscarImagen
};



