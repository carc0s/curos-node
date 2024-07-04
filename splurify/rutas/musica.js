const express = require('express');
const router = express.Router();
const contro = require('../controllers/musica');

const check = require("../middleware/auth.js");

const multer = require("multer");

//configurar multer
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imagenes/musicas");
    },
    filename: (req, file, cb) => {
        cb(null, "musicas" + Date.now() + file.originalname);
    }
});


const subida = multer({ storage: almacenamiento });

//rutas
router.get("/get", contro.getUsers);

router.post("/registrar", check.auth, contro.registratmusica);
router.get("/musica/:id", check.auth, contro.buscarmusica);
router.get("/listamusica/:id/:page?", check.auth, contro.paginacioMusica);
router.put("/updatemusica/:id", check.auth, contro.update);
router.delete("/eliminarmusica/:id", check.auth, contro.elimnarMusica);
router.post("/subir/:id",[check.auth,subida.single("file0")], contro.subirmusica);
router.get("/buscar/:file",check.auth, contro.buscar);
module.exports = router;