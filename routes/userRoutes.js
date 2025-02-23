const express = require('express')
const path = require("path")

//importamos metodos de db
const {selectAllUsers,addUser,updateUser,deleteUser}  = require('../models/userModel')

//iniciamos un 'mini servidor' con prefijos de ruta /user
const router = express.Router()

//middleware para poder recibir json's
router.use(express.json()); 

router.get("/decir_hola",(req,res) => {
    res.status(201).json({ response : 'hola'})
})


//Rutas de los metodos CRUD con sus respectivas llamadas a la base de datos
// ya sea para obtener, agregar , modificar o eliminar información

router.get('/get_students',async (req,res) =>{
    //obtenemos todos los datos de los usuarios y la regresamos en forma de json
    let promesa = await selectAllUsers()
    res.status(200).json({promesa})
})

router.post("/post_students", async (req,res) => {
    //obtenemos del json de la petición el valor de nombre y habilidad 
    let {nombre,habilidad } = req.body
    //pasamos los datos a la función de db
    let promesa = await addUser(nombre,habilidad)
    console.log(promesa)

    //regresamos al usuario que acabamos de agregar
    res.status(201).json({status : "exitoso", promesa})
})

router.post("/update_student", async (req,res) => {
    //obtenemos id,nombre,habilidad de la petición
    let {id,nombre, habilidad} = req.body

    //pasamos los datos a la funcón de db
    await updateUser(id, nombre , habilidad)
    res.status(201).json({response:"to' fine"})
})

router.post("/delete_student", async (req,res) => {
    //obtenemos el id dentro de la petición
    let {id} = req.body
    await deleteUser(id)

    res.status(201).json({response : "elimnado con exito"})
    
    
})

//subimos al cliente la carpeta pubic
router.use(express.static('public'));

//definomos nuestra ruta raíz de users, como dentro de nuestro archivo principal
// definimos que todas las rutas dentro del archivo 'userRoutes' es sufuciente poner '/'
router.get('/',(req, res) =>{
    //regresamos el html
    res.sendFile(path.join(__dirname,'../views/user.html'))
});





module.exports = router