//importar 
const Seguir = require('../modelos/seguir');
const userVO = require('../modelos/userVO');




//guardar seguir


const Seguirguardar = async (req, res) => {
    // Conseguir datos 
    const params = req.body;
    const sesion = req.user;

    // Crear objeto a guardar
    let seguir = new Seguir({
        id_usuario: sesion._id,
        id_seguidor: params.seguir,
    });

    try {
        // Guardar en la base de datos 
        await seguir.save();

        return res.status(200).json({
            status: "success",
            seguir: "Seguir a un usuario",
            id:req._id,
            seguido: seguir,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al guardar la información",
        });
    }
}
//eliminar seguir

const SeguirEliminar = async (req, res) => {
    // Conseguir datos 
    const seguirId = req.params.id;
    const sesion = req.user;

    try {
        // Validar que el ID de seguir existe
        if (!seguirId) {
            return res.status(400).json({
                status: "error",
                message: "El id del seguimiento es necesario."
            });
        }

        // Eliminar el seguimiento de la base de datos
        const result = await Seguir.findOneAndDelete({
            id_seguidor: seguirId,
            id_usuario: sesion._id
        });

        if (!result) {
            return res.status(404).json({
                status: "error",
                message: "No se encontró el seguimiento especificado.",
                resultado:result,
            });
        }

        // Responder con éxito
        return res.status(200).json({
            status: "success",
            message: "Dejar de seguir a un usuario con éxito",
            //eliminado: result,
        });
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({
            status: "error",
            message: "Error al eliminar la información",
            error: error.message,
        });
    }
};

//exportar modulo
module.exports = {
    Seguirguardar,
    SeguirEliminar
}