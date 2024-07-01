const express = require('express');
const router = express.Router();
const contromusica = require('../controllers/musica');


router.get("/get", contromusica.getUsers);




module.exports = router;