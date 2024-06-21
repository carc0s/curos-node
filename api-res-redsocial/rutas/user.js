// ruta de usuario
const express = require('express');
const router = express.Router();
const daousuario = require('../controladores/DAOuser.js');
const check = require('../middleware/auth.js');
// definir rutas
router.get("/pruebas",check.auth, daousuario.getUsers);
router.post("/registrarusu", daousuario.registrarusu);
router.post("/login", daousuario.login);
router.get("/user/:id",check.auth, daousuario.perfil);
router.get("/paginacion/:page?",check.auth, daousuario.paginacion);
// exportar módulo
module.exports = router;
