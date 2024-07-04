const express = require('express');
const router = express.Router();
const contro = require('../controllers/artista');

const check = require("../middleware/auth.js");
const multer = require("multer");

//configurar multer
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imagenes/artistas");
    },
    filename: (req, file, cb) => {
        cb(null, "fotoartista" + Date.now() + file.originalname);
    }
});


const subida = multer({ storage: almacenamiento });

//rutas

router.get("/get", contro.getUsers);

router.post("/registrar", check.auth, contro.registrarArtista);
router.get("/artista/:id",check.auth, contro.buscarartista);
router.get("/listaArtista/1",check.auth, contro.paginacionArtista);
router.put("/updateArtista/:id",check.auth, contro.update);
router.delete("/eliminarArtista/:id",check.auth, contro.eliminarArtista);

module.exports = router;