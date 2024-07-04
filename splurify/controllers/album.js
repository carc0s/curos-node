const fs = require("fs");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose-pagination');
const path = require("path");
const album = require("../modelos/album");



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








// Registrar album

const registrarAlbum = async (req, res) => {
  // Recoger datos de la petición
  let params = req.body;

  // Validar datos
  if (!params.nombre || !params.descripcion) {
    return res.status(400).json({
      status: "error",
      message: "Datos incompletos",
    });
  }



  try {


    // Crear nuevo usuario
    let nuevoAlbum = new album(params);

    // Guardar usuario en la base de datos
    await nuevoAlbum.save();


    return res.status(200).json({
      status: "success",
      message: "Usuario registrado exitosamente",
      Album: nuevoAlbum,
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

const buscaralbum = async (req, res) => {
  try {
    // Obtener el ID del usuario de los parámetros de la ruta
    const id = req.params.id;

    // Validar que se ha proporcionado un ID
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "ID de usuario es requerido",
      });
    }

    // Buscar usuario en la base de datos
    const albumes = await album.findById(id).populate('idArtista', '-__v -_id');

    // Verificar si el usuario ya existe
    if (!albumes) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario oiko",
      albumes,

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
const paginacionAlbum = async (req, res) => {
  try {
    // Obtener la página actual de los parámetros de la ruta
    const page = req.params.page ? parseInt(req.params.page, 10) : 1;
    const perPage = 5;

    // Obtener el total de documentos en la colección de usuarios
    const total = await album.countDocuments();

    // Obtener los usuarios para la página actual
    const userDocs = await album.find({})
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
      album: userDocs,
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

//actulizar datos de artista
const update = async (req, res) => {
  try {
    // Obtener el ID del usuario autenticado
    const userId = req.params.id;

    // Obtener los datos del formulario
    const params = req.body;


    // Actualizar los datos del usuario
    const albumActualizado = await album.findByIdAndUpdate(userId, params, { new: true });

    if (albumActualizado) {
      return res.status(200).json({
        status: "success",
        message: "Usuario actualizado correctamente",
        artista: albumActualizado,
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
      console.log(id);
      // Buscar y actualizar el artículo
      let foto = await album.findByIdAndUpdate(id, { imagen: req.file.filename }, { new: true });

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
  let rutaarchivo = "./imagenes/albums/" + archivo;

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



//exportar funciones

module.exports = {
  getUsers,
  registrarAlbum,
  buscaralbum,
  paginacionAlbum,
  update,
  subirImagen,
  buscarImagen
};