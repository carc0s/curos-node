//ruta de articulo
const express = require("express");

const multer = require("multer");
const router = express.Router();
//controlador de articulo
const ArticuloDAO = require("../controladores/ArticuloDAO");

//configurar multer
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imagenes/articulos");
    },
    filename: (req, file, cb) => {
        cb(null, "articulo" + Date.now + file.originalname);
    }
});
const subida = multer({ storage: almacenamiento });




//rutas de pruebas
router.get("/ruta-de-prueba", ArticuloDAO.prueba)
router.get("/curso", ArticuloDAO.curso)

//rtuta de crear articulo

router.post("/crear", ArticuloDAO.crear)

router.get("/listar/:ultimos?", ArticuloDAO.listar)

router.get("/buscar/:id", ArticuloDAO.buscaruno)

router.delete("/eliminar/:id", ArticuloDAO.eliminar)

router.put("/modificar/:id", ArticuloDAO.modificar)

router.post("/subir-imagen/:id", [subida.single("file0")], ArticuloDAO.subirimagen)

router.get("/imagen/:imagen", ArticuloDAO.imagen)

router.get("/buscador/:palabra", ArticuloDAO.buscador)


module.exports = router;