const express = require('express')
const app = express()
const Joi = require('@hapi/joi')
const morgan = require('morgan')
const config = require('config')
//json() es un middleware que nos permite transformar los datos de una peticion a json, en este caso se esta queriendo
//queriendo transformar los datos que se envian por POST en forma de json
app.use(express.json())
//variable de entorno, en caso de que se cambie el puerto que interactuara con el servidor o que estemos en produccion
//y no podamos poner uno nosotros mismos
const port = process.env.PORT || 3000
// Esta funcion compara el id enviado como parametro por la url y el id de cada uno de los objetos dentro del objeto usuario
function encontrarUsuario(idParam){
    return (usuarios.find(u => u.id === parseInt(idParam)))

}
app.use(morgan('tiny'))

//objeto de datos
const usuarios = [
    { id: 1, name: "Guillermo" },
    { id: 2, name: "Francisco" },
    { id: 3, name: "Moises" },

]
//Configuracion de entornos
console.log('Aplicacion: ' +  config.get('nombre'))
console.log('BD server: ' + config.get('configDB.host'))


app.get('/', (req, res) => {
    res.send('hola mundo con express')
})
app.get('/api/usuarios',(req,res)=>{
    res.send(usuarios)
})
app.get('/api/usuarios/:id', (req, res) => {
    //con esta linea de codigo iteramos el objeto usuarios y devolvemos un objeto siempre y cuando el id de este
    //coincida con el id enviado por parametro por el cliente
    // let usuario = usuarios.find(u => u.id === parseInt(req.params.id))
    let usuario = encontrarUsuario(req.params.id)
    //Esta linea de codigo es para ver si coincide el id del objeto con el id enviado como parametro en la url
    //si no es asi entonces se enviara un mensaje de 404
    if (!usuario) res.status(404).send('pagina no encontrada')
    res.send(usuario)
})

app.post('/api/usuarios', (req, res) => {
  //en esta solicitud de tipo post se esta haciendo uso de la libreria
  //@hai/joi para poder validar los datos que se estan enviando
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    })
    const { error, value } = schema.validate({ nombre: req.body.nombre })
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        }
        usuarios.push(usuario)
        res.send(usuario)
        return
    }else{
        const mensaje = error.details[0].message
        res.status(400).send(mensaje);
    }

})

app.put('/api/usuarios/:id',(req,res)=>{
 //con esta linea de codigo iteramos el objeto usuarios y devolvemos un objeto siempre y cuando el id de este
    //coincida con el id enviado por parametro por el cliente
    // let usuario = usuarios.find(usuario => usuario.id === parseInt(req.params.id))
    let usuario = encontrarUsuario(req.params.id)
    //Esta linea de codigo es para ver si coincide el id del objeto con el id enviado como parametro en la url
    //si no es asi entonces se enviara un mensaje de 404
    if (!usuario) res.status(404).send('pagina no encontrada')

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    })
    const { error, value } = schema.validate({ nombre: req.body.nombre })
    if (error) {
        const mensaje = error.details[0].message
        res.status(400).send(mensaje);
        console.log(error)
        return
    }

    usuario.name = value.nombre
    res.send(usuarios)
})

app.delete('/api/usuarios/:id',(req, res)=>{
    let usuario = encontrarUsuario(req.params.id)
    if(!usuario) {
        res.status(404).send('Esta pagina no ha sido encontrada')
        return
    }
    const indexUsuario = usuarios.indexOf(index)
    usuarios.splice(indexUsuario,1)
    res.send(usuarios)
})


app.listen(port, () => {
    console.log(`esto funciona en el puerto ${port}`)
})

