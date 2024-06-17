//ruta de usuario
const express = require('express');
const router = express.Router();
const seguir = require('../controladores/seguir');
//definir rutas
router.get("/pruebas-seguir", seguir.getSeguir);

//exportar modulo
module.exports = router;