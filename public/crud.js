//dentro de este archivo con el cual cuenta el cliente vamos a manejar las llamadas a las rutas, esto a traves de la funcion asincrona fetch

//hacemos uso de la libreria data tables y jquery
//creamos un objeto de tabla
let table = new DataTable('#myTable', {
    responsive: true
    
});



document.addEventListener('DOMContentLoaded', async () => {
    
    //una vez nuestro html de donde se cargó nuestro js
    // obtenemos los datos de los usuarios almacenados en nuestra db
    let promesa = await getStudents()
    let students = promesa['promesa']

    //le pasamos a nuestra función de mostrar los datos
    displayStudents(students)

});


//funcón de mostrar usuarios(estudiantes)
async function displayStudents(students) {
    
    //iteramos a traves de cada estudiante
    for(let student of students){   
        displayAddedStudent(student)
        
    }
   
}


function displayAddedStudent(student){
    
    //definimos una variable por cada campo que contendra nuestra tabla
    let id = student['Id']
    let nombre = student['Name']
    let habilidad = student['Habilidad']

    //campo que contiene nuestros botones de actualizar y borrar, cada uno con su propia función para poder actualizar y borrar respectivamente
    let update_btn = `<button onclick="showUpdateStudent( '${id}','${nombre}','${habilidad}')">Update</button>`
    let delete_btn = `<button onclick="showDeleteStudent( '${id}','${nombre}','${habilidad}')">Delete</button>`
    
    //hacemos uso de nuestra tabla y agregamos los campos que contiene la columna y los mostramos dentro de nuestro html
    table.row.add([id,nombre,habilidad,update_btn, delete_btn]).draw()
   
}



//función que espera el click de nuestro boton de aceptar dentro de nuestro modal
document.getElementById('btn_accept').addEventListener('click',async function handleClick(){

    //dependiendo del titulo (que se ve modificado dependiendo de que boton es presionado)
    //entramos a un diferente caso (get,post,put{post},delete)
    
    let title = document.getElementById("modalTitle").innerText
  
    switch (title) {
        case 'Add':

            //añadimos al usuario
            await addStudent()
            
            //hacemos uso de jquery y ocultamos el modal una vez el usuario se añadio con éxito
            $('#myModal').modal('hide');
            
            break;
        case 'Update':
            try {

                
                //obtenemos los datos que ingreso el usuario dentro de los inputs de actualizar usuario(estudiante)
                let id = document.getElementById('id_update').innerText
                let nombre = document.getElementById('nombre_update').value
                let habilidad = document.getElementById('habilidad_update').value

                //los asignamos a un objeto para poder convertirlo a un json para efectuar la petición a la ruta
                let data = {
                    id : id,
                    nombre : nombre,
                    habilidad :habilidad
                }
                        
                //llamamos a nuestra función de actualizar 
                await updateStudent(data)

                //actualizamos nuestra columna
                updateRow(nombre,habilidad)

                //ocultamos el modal
                $('#myModal').modal('hide');
                
            } catch (error) {
                console.log(error)    
            }
            break
        case 'Delete':

            //obtenemos el id del usuario a eliminar a partir de un parrafo que se encuentra oculto
            let id = document.getElementById('id_update').innerText
            
            //llamamos a nuestra función de borrar
            await deleteStudent(id)

            //borramos la columna
            deleteRow()

            //ocultamos el modal
            $('#myModal').modal('hide');
                
            break
        default:
            break;
    }
})

async function getStudents() {
    //función asincrona que accede a la ruta '/user/get_students/' y obtiene todos los usuarios
    let promesa = await fetch('/user/get_students')
    let students = await promesa.json()

    //devuelve la respuesta de nuestra ruta como objeto de js 
    return students
}



async function addStudent() {

    //obtenemos información ingresada en los campos y la asignamos a un objeto para poder convertir este objeto a un json
    let nombre = document.getElementById("nombre").value 
    let habilidad = document.getElementById("habilidad").value 
    let info = {
        nombre : nombre,
        habilidad : habilidad
    }    

    console.log(nombre,habilidad)

    //prevenimos que la accion por default se efectue, esta en un formulario siendo la de reiniciar la pagina
    // cosa que si pasa previene que la información llegue de regreso a una funcion asincrona    
    event.preventDefault()
   
    try {
        //efectuamos nuestro fetch a la ruta POST
        let promesa = await fetch('/user/post_students',{
            method : 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(info)
        })
        //obtenemos el usuario que acabamos de agregar 
        let response = await promesa.json()
        console.log("La respuesta del fetch es de")
        console.log(response)

        //lo enseñamos dentro de nuestra tabla
        displayAddedStudent(response['promesa'][0])

        return response

        
    } catch (error) {
        console.log(error)
    }

    
}




async function updateStudent(data) {

    //hacemos una petición a la ruta 
    let promesa = await fetch("/user/update_student",{
                method : 'POST',
                headers :{
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(data)
                })
                let res = await promesa.json()
                console.log(res)
                console.log("Modificado con exito")
                
}

//borrar usuario
async function deleteStudent(id){
    let data = {
        id:id
    }

    //efectuamos nuestra petición a la ruta
    await fetch("/user/delete_student",{
        method : "POST",
        headers:{
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    })



}

//actualizar una columna
function updateRow(nombre,habilidad){

    //obtenemos el id del usuario que buscamos actualizar    
    let id = document.getElementById('id_update').innerText
    let i = 0

    //iteramos a traves de cada columna
        table.rows().every(function() {
            let data = this.data(); 
            console.log(data)
            //buscamos que el id de la columna en la que estamos iterando coincida con el id del usuario que queremos modificar
            if (data[0] == id) { 

                //asignamos los datos nuevos a la columna deseada
                data[1] = nombre
                data[2] = habilidad

                //al la función row hacer uso de numeración 
                //accedemos a la columna deseada con nuestra posición en la iteración
                table.row(i).data(data)

            }
            i+=1
          });
          
          //actualizamos los datos en la tabla
          table.draw();

}

//borrar columna
function deleteRow(){

    try {
        //obtenemos el id de la columna de usuario a eliminar
        let id = document.getElementById('id_update').innerText
        
        //iteramos por todas las columnas hasta encontrar la columna donde el id a borrar es el mismo
        table.rows().every(function() {
            let data = this.data(); 
            if (data[0] == id) { 
                //borramos la columna donde coincidan los id's
              this.remove(); 
            }
          });
          
          table.draw();

    } catch (error) {
        console.log(error)
    }
}

//funcón para mostrar el modal de actualizar estudiante
//esta funcón fue cargada en cada uno de los usuarios agregados a nuestra tabla
//cada función cargada con su id,nombre,habilidad
function showUpdateStudent(id,name,habilidad){

    console.log(name,habilidad)
    
    //cambiamos el nombre de nuestro boton a update
    document.getElementById('btn_accept').innerText = "Update"
    $('#myModal').modal('toggle');

    //cambiamos el nombre de nuestro titulo para que una vez se vea presionado entre al caso correcto
    document.getElementById("modalTitle").textContent = "Update"


    let modal_body = document.getElementById("modal-body")
    
    //creamos el html donde el usuario ingresara los datos que quiere actualizar
    let display = `
        <p id = "id_update" >${id}</p>
        
        
        <input type="text" value = ${name} name = "nombre" id="nombre_update">
        <input type="text" value = ${habilidad} name="habilidad" id = "habilidad_update">
        <br>
    `

    //asignamos nuestros elementos a el cuerpo de nuestro modal
    modal_body.innerHTML = display

    //ocultamos un parrafo que contiene el id del usuario a modificar
    $("#id_update").hide();
   
}

//función para mostrar estudiante
function showAddStudent(){

    document.getElementById('btn_accept').innerText = "Añadir"
  
    $('#myModal').modal('toggle');
    //cambiamos el titulo
    document.getElementById("modalTitle").textContent = "Add"
    let modal_body = document.getElementById("modal-body")
    
    //creamos display
    let display = `
        <form >
        <label for="">Nombre de estudiante: </label>
        <input type="text"  name = "nombre" id="nombre">
        <br>
        <label for="">Habilidad del estudiante</label>
        <input type="text"  name="habilidad" id = "habilidad">
        <br>
        
    </form>
        `

    //asignamos display
    modal_body.innerHTML = display

}


//mostrar estudiante a eliminar
function showDeleteStudent(id,name,habilidad){
    document.getElementById('btn_accept').innerText = "Eliminar"
    console.log(name,habilidad)
    $('#myModal').modal('toggle');

    //cambiamos el titulo
    document.getElementById("modalTitle").textContent = "Delete"
    let modal_body = document.getElementById("modal-body")
    

    let display = `
        <p id = "id_update" >${id}</p>
        <p> ¿ Estas seguro que quieres eliminar al estudiante  "${name}" con habilidad de "${habilidad}"
        ?</p>
        `

    //asignamos display
    modal_body.innerHTML = display
    
    $("#id_update").hide();
    
}

function pareceSerQueSiChecóMiCodigo(){
    console.log("hola maestra")
}

