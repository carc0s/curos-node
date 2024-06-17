//acciones de prueba
const getSeguir = (req, res) => {
    return res.status(200).json([{
        seguir: "Seguir a un usuario",
        autor: "Jhonny",
        url: "https://www.udemy.com/course/curso-de-node-js/",
    },
    {
        seguir: "Dejar de seguir a un usuario",
        autor
            : "Jhonny",
        url: "https://www.udemy.com/course/curso-de-node-js/",
    },
    ]);
}
//exportar modulo
module.exports = {
    getSeguir
}