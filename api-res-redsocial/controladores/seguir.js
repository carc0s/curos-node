const Seguir = require('../modelos/seguir');
const UserVO = require('../modelos/userVO');
const publicacion = require('../modelos/publicacion');
const servicioseguir = require('../servicios/seuidosId');

// Guardar seguimiento
const Seguirguardar = async (req, res) => {
    const params = req.body;
    const sesion = req.user;

    // Crear objeto a guardar
    let nuevoSeguimiento = new Seguir({
        id_usuario: sesion._id,
        id_seguidor: params.seguir,
    });

    try {
        // Guardar en la base de datos 
        await nuevoSeguimiento.save();

        return res.status(200).json({
            status: "success",
            message: "Seguir a un usuario",
            seguimiento: nuevoSeguimiento,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Error al guardar la información",
            error: error.message,
        });
    }
};

// Eliminar seguimiento
const SeguirEliminar = async (req, res) => {
    const seguirId = req.params.id;
    const sesion = req.user;

    try {
        // Validar que el ID de seguimiento existe
        if (!seguirId) {
            return res.status(400).json({
                status: "error",
                message: "El ID del seguimiento es necesario."
            });
        }

        // Eliminar el seguimiento de la base de datos
        const result = await Seguir.findOneAndDelete({
            _id: seguirId,
            id_usuario: sesion._id
        });

        if (!result) {
            return res.status(404).json({
                status: "error",
                message: "No se encontró el seguimiento especificado.",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Dejar de seguir a un usuario con éxito",
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

// Paginación de seguidos por un usuario específico
// Función para obtener paginación
const obtenerPaginacion = (req) => {
    const page = req.params.page ? parseInt(req.params.page, 10) : 1;
    const perPage = 5;
    return { page, perPage };
};

// Paginación de seguidos por un usuario específico
const paginacionSeguidos = async (req, res) => {
    try {
        // Obtener el id del usuario de la sesión o del parámetro de la URL
        let sesion = req.user._id;
        if (req.params.id) sesion = req.params.id;

        const { page, perPage } = obtenerPaginacion(req);

        // Obtener el total de documentos de seguimientos por el usuario actual
        const total = await Seguir.countDocuments({ id_seguidor: sesion });

        // Obtener los seguimientos para la página actual
        const seguimientos = await Seguir.find({ id_seguidor: sesion })
            .populate("id_usuario id_seguidor", "-password -rol -__v -email") // Excluir campos innecesarios
            .sort({ _id: -1 }) // Ordenar por ID descendente
            .skip((page - 1) * perPage) // Saltar los documentos según la página
            .limit(perPage);

        // listado
        let idseguidos = await servicioseguir.seguirid(sesion);

        return res.status(200).json({
            status: "success",
            message: "Seguimientos obtenidos correctamente",
            seguimientos,
            datosS_de_siguiendo: idseguidos.seguidores,
            datos_de_seguidos: idseguidos.seguidos,
            totalSeguimientos: total,
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

// Paginación de todos los seguidores
const paginacionSeguidores = async (req, res) => {
    try {
        // Obtener el id del usuario de la sesión o del parámetro de la URL
        let sesion = req.user._id;
        if (req.params.id) sesion = req.params.id;
        console.log("sesion",  req.params.id);
        const { page, perPage } = obtenerPaginacion(req);

        // Obtener el total de documentos de seguimientos por el usuario actual
        const total = await Seguir.countDocuments({ id_usuario: sesion });

        // Obtener los seguimientos para la página actual
        const seguimientos = await Seguir.find({ id_usuario: sesion })
            .populate("id_seguidor", "-password -rol -__v -email") // Excluir campos innecesarios
            .sort({ _id: -1 }) // Ordenar por ID descendente
            .skip((page - 1) * perPage) // Saltar los documentos según la página
            .limit(perPage);

        // listado
        let idseguidos = await servicioseguir.seguirid(sesion);

        return res.status(200).json({
            status: "success",
            message: "Listado de usuarios que me siguen",
            seguimientos,
            datosS_de_siguiendo: idseguidos.seguidores,
            datos_de_seguidos: idseguidos.seguidos,
            totalSeguimientos: total,
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

const contador =async(req,res)=>{
    let sesion = req.user._id;    
    if(req.params.id){
        sesion = req.params.id;

    }
    try {
        const totalmeSeguidos = await Seguir.countDocuments({ id_seguidor: sesion });
        const totalSigo = await Seguir.countDocuments({ id_usuario: sesion });
        const totalPublicaciones = await  publicacion.countDocuments({ user: sesion });
        return res.status(200).json({
            status: "success",
            message: "Contador de seguidores",
            totalSeguidos: totalmeSeguidos,
            totalSigo: totalSigo,
            totalPublicaciones: totalPublicaciones,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Error del servidor",
            error: error.message,
        });
    }

}

module.exports = {
    Seguirguardar,
    SeguirEliminar,
    paginacionSeguidos,
    paginacionSeguidores,
    contador
};
