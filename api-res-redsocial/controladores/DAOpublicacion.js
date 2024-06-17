//acciones de prueba
const getPublicacion = (req, res) => {
    return res.status(200).json([{
        publicacion: "Crear una publicacion",
        autor: "Jhonny",
        url: "https://www.udemy.com/course/curso-de-node-js/",
    },
    {
        publicacion: "Eliminar una publicacion",
        autor: "Jhonny",
        url: "https://www.udemy.com/course/curso-de-node-js/",
    },
    ]);
}
//exportar modulo   
module.exports = {
    getPublicacion
}