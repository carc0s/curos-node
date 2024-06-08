//ruta de articulo
const express= require("express");

const router=express.Router();
//controlador de articulo
const ArticuloDAO = require("../controladores/ArticuloDAO");

//rutas de pruebas
router.get("/ruta-de-prueba",ArticuloDAO.prueba)
router.get("/curso",ArticuloDAO.curso)

//rtuta de crear articulo

router.post("/crear",ArticuloDAO.crear)

router.get("/listar",ArticuloDAO.listar)

module.exports=router;