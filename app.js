import express from "express"
import { engine } from "express-handlebars"
import mongoose from "mongoose"



const app = express()


app.engine('handlebars', engine())
app.set('view engine','hanldebars')
app set('views', './views')


app.use(express.static('public'))



app.use(express.json())
app.use(express.urlencoded({ extended:true }))

const server = app.listen(8080, () =>
console.log('Server running in port 8080')
)


