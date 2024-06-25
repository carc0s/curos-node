const Seguir = require('../modelos/seguir');
const UserVO = require('../modelos/userVO'); 

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
const paginacionSeguidos = async (req, res) => {
    try {
        let sesion = req.user._id;

        if (req.params.id) sesion = req.params.id;
        const page = req.params.page ? parseInt(req.params.page, 10) : 1;
        const perPage = 5;

        // Obtener el total de documentos de seguimientos por el usuario actual
        const total = await Seguir.countDocuments({ id_usuario: sesion });

        // Obtener los seguimientos para la página actual
        const seguimientos = await Seguir.find({ id_usuario: sesion })
            .populate("id_usuario id_seguidor")

            .sort({ _id: -1 }) // Ordenar por el ID descendente o cualquier otro criterio adecuado
            .skip((page - 1) * perPage)
            .limit(perPage);

        return res.status(200).json({
            status: "success",
            message: "Seguimientos obtenidos correctamente",
            seguimientos,
           /* totalSeguimientos: total,
            totalPages: Math.ceil(total / perPage),
            currentPage: page,*/
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
        let sesion = req.user._id;

        if (req.params.id) sesion = req.params.id;
        const page = req.params.page ? parseInt(req.params.page, 10) : 1;
        const perPage = 5;

        // Obtener el total de documentos en la colección de usuarios
        const total = await Seguir.countDocuments();

        // Obtener los usuarios para la página actual
        const userDocs = await Seguir.find({
            id_usuario: sesion
        }).populate("id_usuario id_seguidor")
            .sort('id')
            .skip((page - 1) * perPage)
            .limit(perPage);


        return res.status(200).json({
            status: "success",
            message: "Seguimientos obtenidos correctamente",
            seguimientos,
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

module.exports = {
    Seguirguardar,
    SeguirEliminar,
    paginacionSeguidos,
    paginacionSeguidores
};
