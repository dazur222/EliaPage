//importamos la libreria para poder conectarnos a sql server
const sql = require('mssql')

//creamos un objeto que contiene nuestras credenciales de conexión
const credentials = {
    user : 'EliaPagina',
    password : '123',
    server : 'localhost',
    database : 'Eliadb',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

//definimos una función de conexion
async function connectDb() {
    try {
        //nos conectamos con la db
        const pool = await sql.connect(credentials)
        console.log("Estoy dentro")

        //regresamos nuestro objeto de conexion
        return pool;
    } catch (error) {
        console.log(error)
    }
}

//exportamos la libreria de conexion y nuestra función de conexion
module.exports = {sql,connectDb}

