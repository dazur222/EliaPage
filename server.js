//importamos express y path
const express = require('express');
const path = require('path');

//le asignamos la ruta a nuestro archivo de rutas a una variable
const userRoutes  = require('./routes/userRoutes')

//inicializamos nuestro servidor
const app = express();
const PORT = 3000;

//middleware para poder interpretar query strings
app.use(express.urlencoded({ extended: true })); 


//definimos que todas las rutas dentro de nuestro archivo de usuario contrndran '/user'
app.use('/user',userRoutes)

//subimos al cliente la carpeta 'public'
app.use(express.static('public'));

//definimos nuestra ruta raíz y cuando se entra regresamos nuestro archivo html
app.get('/', (req,res ) => {
    res.sendFile(path.join(__dirname,'views','index.html'));
})

//arrancamos el server
app.listen(PORT, () => {
    console.log("Up mi papu");
    const file_path = path.join(__dirname,'views','index.html')
    
});