const express = require('express');
const router = express.Router();
const controuser = require('../controllers/user');


router.get("/get", controuser.getUsers);




module.exports = router;