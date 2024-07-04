const express = require('express');
const router = express.Router();
const contro = require('../controllers/album.js');

const check = require("../middleware/auth.js");

const multer = require("multer");

//configurar multer
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imagenes/albums");
    },
    filename: (req, file, cb) => {
        cb(null, "fotoAlbum" + Date.now() + file.originalname);
    }
});


const subida = multer({ storage: almacenamiento });

//rutas
router.get("/get", contro.getUsers);

router.post("/registrar", check.auth, contro.registrarAlbum);
router.get("/album/:id", check.auth, contro.buscaralbum);
router.get("/listaAlbum/:page?", check.auth, contro.paginacionAlbum);
router.put("/updateAlbum/:id", check.auth, contro.update);
router.post("/subir/:id",[check.auth,subida.single("file0")], contro.subirImagen);
router.get("/buscar/:file",check.auth, contro.buscarImagen);
module.exports = router;



module.exports = router;