//acciones de prueba
const publicacion = require('../modelos/publicacion');


//guardar publicacion
const savePublicacion =async(req,res)=>{
    const params = req.body;
    const sesion = req.user;

    //validar datos
    
    // Crear objeto a guardar
    let publicacionGuardar = new Seguir({
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











    return res.status(200).json({
        status: "success",
        message: "Publicacion registrado exitosamente",
     
      });


}
//listar todas las publicaciones


//listar publicacion de un usuario

//eliminar publicaciones

//subir imagenes 


//buscar imagenes 
//exportar modulo   
module.exports = {
    savePublicacion
}