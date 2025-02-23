//importamos la libreria de conexion y nuestra objeto de conexión (funcion que regresa el objeto de conexión)
const {sql,connectDb} = require('../db/db');



//función que regresa todos los campos de nuestra tabla de Estudiantes
async function selectAllUsers() {
    try {
        //hacemos uso de nuestra conexion y realizamos una petición de una conexión
        const pool = await connectDb()
        const result = await pool.request().query("select * from Students")
        
        //regresamos el resultado de nuestro query
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}

//añadir usuario
async function addUser(nombre,habilidad){
    try {
        //nos conectamos
        const pool = await connectDb()

        //hacemos uso de .input para prevenir una inyección sql
        const result = await pool.request()
        .input("Name",sql.VarChar,nombre)
        .input("Habilidad",sql.VarChar,habilidad)
        .query("insert into Students(Name,Habilidad) values(@Name,@Habilidad)  select top 1 * from Students order by id desc")


        
        console.log("El usuario que acabamos de añadir es")
        console.log(result.recordset)
        
        //regresamos al usuario que acabamos de añadir
        return result.recordset
        

    } catch (error) {
        console.log(error)
    }

}

//actualizar
async function updateUser(id,nombre,habilidad) {
    //actualizamos campos basandonos en el id como condición
    const pool = await connectDb()
    const result = await pool.request().input("Nombre",sql.VarChar,nombre).input("Habilidad",sql.VarChar,habilidad).input("Id",sql.Int,id).
    query("update Students set Name = @Nombre, Habilidad = @Habilidad where Id = @Id")

}

//eliminar
async function deleteUser(id) {

    //eliminamos la columna que contenga el mismo id que nosotros proveamos
    const pool = await connectDb()
    const result = await pool.request().input("Id",sql.Int,id).query("delete from Students where Id = @Id")
}



//exportamos nuestras funciones para ser utilizadas en nuestras rutas de usuario
module.exports = {selectAllUsers,addUser,updateUser,deleteUser}
