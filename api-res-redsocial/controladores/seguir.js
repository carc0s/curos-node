//importar 
const Seguir = require('../modelos/seguir');
const userVO = require('../modelos/userVO');




//guardar seguir


const Seguirguardar = async (req, res) => {
    //conseguir datos 
    const params = req.body;
    const sesion = req.user;

    //crear objeto a guardar
    let seguir = new Seguir({
        id_usuario: sesion._id,
        id_seguidor: params.seguir,

    });

    //guardar en la base de datos 
    await nuevoUsuario.save();

    
    return res.status(200).json({
        status: "success",
        seguir: "Seguir a un usuario",
        seguido: seguir,
    });

}
//exportar modulo
module.exports = {
    Seguirguardar
}