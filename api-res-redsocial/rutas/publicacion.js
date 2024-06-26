//ruta de usuario
const express = require('express');
const router = express.Router();
const daopublicacion = require('../controladores/DAOpublicacion');
const check = require('../middleware/auth.js');
//definir rutas
router.post("/guardarpubli",check.auth, daopublicacion.savePublicacion);

//exportar modulo
module.exports = router;