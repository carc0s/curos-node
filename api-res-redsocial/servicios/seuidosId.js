//generar un array con los id de los usuarios que sigue el usuario
const seguir = require('../modelos/seguir');










const seguirid =async (userID) => {
    try {
        const seguidores = await seguir.find({ id_usuario: userID })
            .select({"_id":0,"__v":0,"id_usuario":0,"fechaSeguir":0}) 
            .exec();
            
        return seguidores;
    } catch (error) {
        console.error('Error al obtener seguidores:', error);
        throw error; // Re-lanzar el error para manejarlo donde se llame esta función
    }
}




const seguido=async(sesion,perfilId)=>{

}
//exportar modulo
module.exports = {
    seguirid,
seguido
};