const fs = require("fs");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose-pagination');
const path = require("path");
const musica = require("../modelos/musicas");
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

const registratmusica = async (req, res) => {
  // Recoger datos de la petición
  let params = req.body;

  // Validar datos
  if (!params.nombre) {
    return res.status(400).json({
      status: "error",
      message: "Datos incompletos",
    });
  }



  try {


    // Crear nuevo usuario
    let nuevamusica = new musica(params);

    // Guardar usuario en la base de datos
    await nuevamusica.save();


    return res.status(200).json({
      status: "success",
      message: "Usuario registrado exitosamente",
      Musica: nuevamusica,
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

const buscarmusica = async (req, res) => {
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
    const musicas = await musica.findById(id).populate('idAlbum', '-creadoel -_id -idArtista -__v');

    // Verificar si el usuario ya existe
    if (!musicas) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario oiko",
      musicas,

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
const paginacioMusica = async (req, res) => {
  try {
    // Obtener la página actual de los parámetros de la ruta
    const page = req.params.page ? parseInt(req.params.page, 10) : 1;
    const perPage = 5;

    // Obtener el total de documentos en la colección de usuarios
    const total = await musica.countDocuments({ idAlbum: req.params.id });
    const id = req.params.id;

    // Obtener los usuarios para la página actual
    const userDocs = await musica.find({ idAlbum: id })
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
      message: "musicas obtenidos correctamente",
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
    const musicaAcutualizado = await musica.findByIdAndUpdate(userId, params, { new: true });

    if (musicaAcutualizado) {
      return res.status(200).json({
        status: "success",
        message: "Usuario actualizado correctamente",
        artista: musicaAcutualizado,
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
const subirmusica = async (req, res) => {
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
  if (archivoextencion != "mp3" && archivoextencion != "ogg" ) {
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
      let foto = await musica.findByIdAndUpdate(id, { archivo: req.file.filename }, { new: true });

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
const buscar = (req, res) => {
  let archivo = req.params.file;
  console.log(archivo);
  let rutaarchivo = "./imagenes/album/" + archivo;

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

//eliminar musica

const elimnarMusica = async (req, res) => {
  const publiId = req.params.id;

  try {


    // Elimina la música asociada a esos álbumes
    const eliMusica = await musica.findOneAndDelete({ _id: publiId })

    if (!eliMusica) {

      return res.status(404).json({
        status: "error",
        message: "No se encontró musica.",
      });
    }



    return res.status(200).json({
      status: "success",
      message: "Publicación eliminada con éxito",
      idEliminado: publiId,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar la información",
      error: error.message,
    });
  }
};

//exportar funciones

module.exports = {
  getUsers,
  registratmusica,
  buscarmusica,
  paginacioMusica,
  update,
  subirmusica,
  buscar,
  elimnarMusica
};

