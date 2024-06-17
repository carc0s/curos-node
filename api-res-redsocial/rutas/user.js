// ruta de usuario
const express = require('express');
const router = express.Router();
const daousuario = require('../controladores/DAOuser.js');

// definir rutas
router.get("/pruebas", daousuario.getUsers);
router.post("/registrarusu", daousuario.registrarusu);
router.post("/login", daousuario.login);

// exportar módulo
module.exports = router;
