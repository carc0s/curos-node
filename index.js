const { conexion } = require('./database/conexion');
const cors = require('cors');
const express = require('express');

// Iniciar la conexión a la base de datos
conexion();

// Crear servidor en Node
const app = express();
const puerto = 3900;

// Configurar CORS
app.use(cors());

// Convertir el cuerpo de las solicitudes en JSON
app.use(express.json());//recibir datos con content-type app/json

app.use(express.urlencoded({ extended: true }));//recibir datos con content-type app/x-www-form-urlencoded

//rutas
const rutas_articulo= require("./rutas/Articuloruta");

//cargando ruta
app.use("/api",rutas_articulo);









// Crear ruta para la raíz
app.get('/', (req, res) => {
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

});

// Crear ruta /probando
app.get('/probando', (req, res) => {
    console.log('Hola mundo');
    return res.status(200).send(`
        <div>
            <h1>Hola mundo</h1>
        </div>
    `);
});

// Crear servidor y escuchar peticiones HTTP
app.listen(puerto, () => {
    console.log('Servidor iniciado en http://localhost:' + puerto);
});

// Path: database/conexion.js