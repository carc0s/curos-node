// ruta de usuario
const express = require('express');
const router = express.Router();
const daousuario = require('../controladores/DAOuser.js');
const check = require('../middleware/auth.js');
const multer = require("multer");

//configurar multer
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imagenes/fotoperfil/");
    },
    filename: (req, file, cb) => {
        cb(null, "fotoperfil" + Date.now() + file.originalname);
    }
});
const subida = multer({ storage: almacenamiento });
// definir rutas
router.get("/pruebas",check.auth, daousuario.getUsers);
router.post("/registrarusu", daousuario.registrarusu);
router.post("/login", daousuario.login);
router.get("/user/:id",check.auth, daousuario.perfil);
router.get("/paginacion/:page?",check.auth, daousuario.paginacion);
router.put("/update/",check.auth, daousuario.update);
router.post("/subir",[check.auth,subida.single("file0")], daousuario.subirImagen);
router.get("/buscar/:file",check.auth, daousuario.buscarImagen);
// exportar módulo
module.exports = router;
