//ruta de usuario
const express = require('express');
const router = express.Router();
const seguir = require('../controladores/seguir');
const check = require('../middleware/auth.js');
//definir rutas
router.post("/seguirusu",check.auth, seguir.Seguirguardar);
router.delete("/dejarseguir/:id",check.auth, seguir.SeguirEliminar);
//exportar modulo
module.exports = router;