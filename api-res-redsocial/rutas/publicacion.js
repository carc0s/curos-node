//ruta de usuario
const express = require('express');
const router = express.Router();
const daopublicacion = require('../controladores/DAOpublicacion');
const check = require('../middleware/auth.js');
const multer = require("multer");



//configurar multer
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imagenes/fotoperfil/publicaciones/");
    },
    filename: (req, file, cb) => {
        cb(null, "publicacion" + Date.now() + file.originalname);
    }
});
const subida = multer({ storage: almacenamiento });
//definir rutas
router.post("/guardarpubli",check.auth, daopublicacion.savePublicacion);
router.get("/buscarpubli/:id",check.auth, daopublicacion.buscarPublicacion);
router.delete("/eliminarpubli/:id",check.auth, daopublicacion.EliminarPublicacion);
router.get("/listarPublicion/:id/:page?",check.auth, daopublicacion.listarPublicacionesUsuario);
router.post("/subir/:id",[check.auth,subida.single("file0")], daopublicacion.subirImagen);
router.get("/buscar/:file",check.auth, daopublicacion.buscarImagen);
router.get("/listarTodasPubliciones/:page?",check.auth, daopublicacion.listarTodasPublicaciones);
//exportar modulo
module.exports = router;