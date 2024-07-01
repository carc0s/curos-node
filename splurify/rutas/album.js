const express = require('express');
const router = express.Router();
const contro = require('../controllers/album');


router.get("/get", contro.getUsers);




module.exports = router;