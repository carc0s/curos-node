//ruta de usuario
const express = require('express');
const router = express.Router();
const daopublicacion = require('../controladores/DAOpublicacion');
//definir rutas
router.get("/pruebas-publicacion", daopublicacion.getPublicacion);

//exportar modulo
module.exports = router;