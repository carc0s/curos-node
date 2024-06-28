//acciones de prueba
const publicacion = require('../modelos/publicacion');
const mongoose = require('mongoose-pagination');


//guardar publicacion
const savePublicacion = async (req, res) => {
    const params = req.body;


    // Validar datos
    if (!params.texto) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Crear objeto a guardar
    let publicacionGuardar = new publicacion(params);
    publicacionGuardar.user = req.user._id;

    try {
        // Guardar en la base de datos 
        await publicacionGuardar.save();

        return res.status(200).json({
            status: "success",
            message: "Publicación guardada correctamente",
            publicacion: publicacionGuardar,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Error al guardar la información",
            error: error.message,
        });
    }
}

//listar publicacion de un usuario
const buscarPublicacion = async (req, res) => {
    try {
        // Obtener usuario autenticado
        const id = req.params._id;
        
        // Validar que se ha proporcionado un ID
        if (!id) {
            return res.status(400).json({
                status: "error",
                message: "ID de usuario es requerido",
            });
        }

        // Buscar usuario en la base de datos
        const publi = await publicacion.findById(id);

        // Verificar si el usuario ya existe
        if (!publi) {
            return res.status(404).json({
                status: "error",
                message: "publicacion no encontrado",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "publicacion encontrada",
            publi,

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

//eliminar publicaciones

const EliminarPublicacion = async (req, res) => {
    const publiId = req.params.id;


    try {
        // Validar que el ID de seguimiento existe
        if (!publiId) {
            return res.status(400).json({
                status: "error",
                message: "El ID del seguimiento es necesario."
            });
        }

        // Eliminar el seguimiento de la base de datos
        const result = await publicacion.findOneAndDelete({
            _id: publiId,
            user: req.user._id
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

const obtenerPaginacion = (req) => {
    const page = req.params.page ? parseInt(req.params.page, 10) : 1;
    const perPage = 2;
    return { page, perPage };
};


// Listar las publicaciones de un usuario
const listarPublicacionesUsuario = async (req, res) => {
    try {
        // Obtener el ID del usuario
        const userId = req.params.id;
        const { page, perPage } = obtenerPaginacion(req);

        // Validar que se ha proporcionado un ID de usuario válido
        if (!userId ) {
            return res.status(400).json({
                status: "error",
                message: "ID de usuario es requerido y debe ser válido",
            });
        }

        // Buscar las publicaciones del usuario en la base de datos
        const publicaciones = await publicacion.find({ user: userId }).populate('user','-bio -password -rol -image -fecha -__v')
            .sort( "-fecha"  ) // Ordenar por ID descendente
            .skip((page - 1) * perPage) // Saltar los documentos según la página
            .limit(perPage); // Limitar la cantidad de documentos a mostrar

            if(!publicaciones || publicaciones.length === 0){
                return res.status(404).json({
                    status: "error",
                    message: "No se encontraron publicaciones del usuario",
                });
            }
        // Obtener el total de publicaciones
        const total = await publicacion.countDocuments({ user: userId });

        return res.status(200).json({
            status: "success",
            message: "Publicaciones del usuario encontradas",
            publicaciones,
            totalPublicaciones: total,
            totalPages: Math.ceil(total / perPage),
            currentPage: page,
        });
    } catch (error) {
        console.error(error); // Log del error para depuración
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
    const idpublicacion = req.params.id;
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
        let foto = await publicacion.findByIdAndUpdate({user:req.user._id, _id:idpublicacion }, { archivo: req.file.filename }, { new: true });
  
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

//listar las publicaciones de los usuarios que sigo
const listarPublicacionesSeguidos = async (req, res) => {
    try {
        // Obtener el ID del usuario autenticado
        const userId = req.user._id;

        // Buscar los usuarios seguidos por el usuario autenticado
        const usuariosSeguidos = await Seguidor.find({ seguidor: userId }).select('usuarioSeguido');

        // Obtener los IDs de los usuarios seguidos
        const usuariosSeguidosIds = usuariosSeguidos.map(usuario => usuario.usuarioSeguido);

        // Buscar las publicaciones de los usuarios seguidos
        const publicaciones = await publicacion.find({ user: { $in: usuariosSeguidosIds } });

        return res.status(200).json({
            status: "success",
            message: "Publicaciones de usuarios seguidos encontradas",
            publicaciones,
        });
    } catch (error) {
        console.error(error); // Log del error para depuración
        return res.status(500).json({
            status: "error",
            message: "Error del servidor",
            error: error.message,
        });
    }
};




//subir imagenes 


//buscar imagenes 
//exportar modulo   
module.exports = {
    savePublicacion,
    buscarPublicacion,
    EliminarPublicacion,
    listarPublicacionesUsuario,
    subirImagen
}