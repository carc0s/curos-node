const fs = require("fs");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose-pagination');
const path = require("path");
const artista = require('../modelos/artista');




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








// Registrar artista

const registrarArtista = async (req, res) => {
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
    let nuevoArtista = new artista(params);

    // Guardar usuario en la base de datos
    await nuevoArtista.save();


    return res.status(200).json({
      status: "success",
      message: "Usuario registrado exitosamente",
      artista: nuevoArtista,
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

const buscarartista = async (req, res) => {
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
    const artistas = await artista.findById(id);

    // Verificar si el usuario ya existe
    if (!artistas) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario logueado",
      artistas,

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
const paginacionArtista = async (req, res) => {
  try {
    // Obtener la página actual de los parámetros de la ruta
    const page = req.params.page ? parseInt(req.params.page, 10) : 1;
    const perPage = 5;

    // Obtener el total de documentos en la colección de usuarios
    const total = await artista.countDocuments();

    // Obtener los usuarios para la página actual
    const userDocs = await artista.find({})
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
      artistas: userDocs,
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
    const artistaActulizado = await artista.findByIdAndUpdate(userId, params, { new: true });

    if (artistaActulizado) {
      return res.status(200).json({
        status: "success",
        message: "Usuario actualizado correctamente",
        artista: artistaActulizado,
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
//eliminar artista

const eliminarArtista = async (req, res) => {
  const publiId = req.params.id;


  try {
    

    const result = await artista.findOneAndDelete({
      _id: publiId,
    });

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "No se encontró la publicacion.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Publicacion eliminada con éxito",
      idEliminado: publiId
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
  registrarArtista,
  buscarartista,
  paginacionArtista,
  update,
  eliminarArtista
};
