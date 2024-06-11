
//importar modelo de articulo
const Articulo = require('../modelos/Articulo');
const { validarDatos } = require('../helper/Validadr');


//contralador de articulo de blog con programacion funcional
const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "hola mundo conectado a la base de datos"

    });
}

const curso = (req, res) => {
    return res.status(200).json([{
        curso: "Curso de Node.js",
        autor: "Jhonny",
        url: "https://www.udemy.com/course/curso-de-node-js/",
    },
    {
        curso: "Curso de Node.js",
        autor: "Jhonny",
        url: "https://www.udemy.com/course/curso-de-node-js/",
    },

    ]);

};
//cosas para la base de datos de articulos

const crear = async (req, res) => {
    //recoger parametros por post
    let parametros = req.body;

    // Validar datos
    const errorValidacion = validarDatos(parametros);
    if (errorValidacion) {
        return res.status(400).json({
            mensaje: errorValidacion
        });
    }
    //crear el objeto a guardar
    const articulo = new Articulo(parametros);
    //asignar valores a objetos basado en el modelo (manual o autamatico)
    //de forma manual
    /* articulo.titulo = parametros.titulo;
     articulo.contenido = parametros.contenido;
     articulo.imagen = null;
     articulo.fecha = null;*/

    //de forma automatica
    //Object.assign(articulo,parametros);


    //guardar el articulo en la base de datos
    try {
        const articuloGuardado = await articulo.save();
        return res.status(200).json({
            mensaje: "crear articulo",
            articulo: articuloGuardado
        });
    } catch (error) {
        return res.status(400).json({
            mensaje: error.message
        });
    }

}
//listar articulos
const listar = async (req, res) => {
    try {
        let articulos;
        const limite = req.params.ultimos || null; // Obtener el parámetro 'limite' o asignar null si no se proporciona

        if (limite) {
            // Si se recibe el parámetro 'limite', aplicar el límite
            articulos = await Articulo.find({})
                .sort({ fecha: 1 })
                .limit(2);
        } else {
            // Si no se recibe el parámetro 'limite', obtener todos los artículos ordenados por fecha
            articulos = await Articulo.find({}).sort({ fecha: 1 });
        }

        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron artículos"
            });
        }

        return res.status(200).json({
            mensaje: "Listado de artículos exitoso",
            articulos
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al buscar artículos",
            error: error.message
        });
    }
};

//buscar un articulo
const buscaruno = async (req, res) => {
    try {
        // Recoger id de artículo por URL
        let id = req.params.id;

        // Buscar artículo
        let articulo = await Articulo.findById(id);

        if (!articulo) {
            return res.status(404).json({
                mensaje: "No se encontró el artículo"
            });
        }

        return res.status(200).json({
            mensaje: "Artículo encontrado",
            articulo
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al buscar el artículo",
            error
        });
    }
};

//eliminar articulo
const eliminar = async (req, res) => {
    try {
        // Recoger id de artículo por URL
        let id = req.params.id;

        // Eliminar artículo
        let articulo = await Articulo.findByIdAndDelete(id);

        if (!articulo) {
            return res.status(404).json({
                mensaje: "No se encontró el artículo"
            });
        }

        return res.status(200).json({
            mensaje: "Artículo eliminado",
            articulo
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al eliminar el artículo",
            error
        });
    }
};
//modificar articulo
const modificar = async (req, res) => {
    let id = req.params.id;
    let parametros = req.body;

    const errorValidacion = validarDatos(parametros);
    if (errorValidacion) {
        return res.status(400).json({
            mensaje: errorValidacion
        });
    }

    // Buscar y actualizar el artículo
    try {
        let articulo = await Articulo.findByIdAndUpdate(id, parametros, { new: true });

        if (!articulo) {
            return res.status(404).json({
                mensaje: "No se encontró el artículo"
            });
        }

        return res.status(200).json({
            mensaje: "Artículo modificado",
            articulo
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al modificar el artículo",
            error
        });
    }
};
module.exports = {
    prueba,
    curso,
    crear,
    listar,
    buscaruno,
    eliminar,
    modificar
}