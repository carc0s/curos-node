//ruta de usuario
const express = require('express');
const router = express.Router();
const seguir = require('../controladores/seguir');
const check = require('../middleware/auth.js');
//definir rutas
router.post("/seguirusu",check.auth, seguir.Seguirguardar);
router.delete("/dejarseguir/:id",check.auth, seguir.SeguirEliminar);
router.get("/paginacionseguir/:id?/:page?",check.auth,  seguir.paginacionSeguidos);
router.get("/paginacionseguidores/:id?/:page?",check.auth,  seguir.paginacionSeguidores);
router.get("/contador/:id?",check.auth,  seguir.contador);
//exportar modulo
module.exports = router;