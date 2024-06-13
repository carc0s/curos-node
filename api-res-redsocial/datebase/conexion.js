const mongoose = require('mongoose');

// Propósito: Conectar a la base de datos
const conexion = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/mi_red");
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error en la base de datos:', error); // Muestra el error en la consola
        throw new Error('Error en la base de datos'); // Lanza el error para que lo maneje el código que importe esta función
    }
};

module.exports = {
    conexion
};
