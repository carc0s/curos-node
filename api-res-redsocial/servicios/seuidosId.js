//generar un array con los id de los usuarios que sigue el usuario
const seguir = require('../modelos/seguir');




const seguirid = async (userID) => {
    try {
        const seguidores = await seguir.find({ id_usuario: userID })
            .select({ "_id": 0, "__v": 0, "id_usuario": 0, "fechaSeguir": 0 ,"email":0})
            .exec();

        const seguidos = await seguir.find({ id_seguidor: userID })
            .select({ "_id": 0, "__v": 0, "id_seguidor": 0, "fechaSeguir": 0, "email":0})
            .exec();

        // Procesar array de seguidores
        let seguidoresArray = [];
        seguidores.forEach(seguidor => {
            seguidoresArray.push(seguidor.id_seguidor);
        });

        // Procesar array de seguidos
        let seguidosArray = [];
        seguidos.forEach(seguidor => {
            seguidosArray.push(seguidor.id_usuario);
        });

        return {
            seguidores: seguidoresArray,
            seguidos: seguidosArray,
        }
    } catch (error) {
        console.error('Error al obtener seguidores:', error);
        throw error; // Re-lanzar el error para manejarlo donde se llame esta función
    }
}



//si me siguen o no
const seguido = async (sesion, perfilId) => {
    const seguidores = await seguir.findOne({ id_usuario: sesion ,id_seguidor: perfilId })
       

    const seguidos = await seguir.findOne({ id_seguidor: perfilId ,id_seguidor: sesion})
        
     
        return {
            seguidores: seguidores,
            seguidos: seguidos,
}

};
//exportar modulo
module.exports = {
    seguirid,
    seguido,

};