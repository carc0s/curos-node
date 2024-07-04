// ruta de usuario
const express = require('express');
const router = express.Router();
const daousuario = require('../controllers/user.js');

const multer = require("multer");
const check = require("../middleware/auth.js");
//configurar multer
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imagenes/");
    },
    filename: (req, file, cb) => {
        cb(null, "fotoperfil" + Date.now() + file.originalname);
    }
});
const subida = multer({ storage: almacenamiento });
// definir rutas

router.post("/registrarusu", daousuario.registrarusu);
router.post("/login" ,daousuario.login);
router.get("/perfil/:id",check.auth, daousuario.perfil);
router.put("/update/",check.auth, daousuario.update);
router.post("/subir",[check.auth,subida.single("file0")], daousuario.subirImagen);
router.get("/buscar/:file",check.auth, daousuario.buscarImagen);
// exportar módulo
module.exports = router;