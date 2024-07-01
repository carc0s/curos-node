const fs = require("fs");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose-pagination');
const path = require("path");

const getUsers = (req, res) => {
    return res.status(200).json([
      {
        user: "Obtener usuarios",
        autor: "Jhonny",
        url: "https://www.udemy.com/course/curso-de-node-js/",
  
      },
      {
        user: "Obtener un usuario",
        autor: "Jhonny",
        url: "https://www.udemy.com/course/curso-de-node-js/",
      },
    ]);
  };

  //exportar funciones

module.exports = {
    getUsers
    };