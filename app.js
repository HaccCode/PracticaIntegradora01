import express from "express"
import { engine } from "express-handlebars"
import mongoose from "mongoose"

import prodsRouter from '.7routes/products.route.js'

const app = express()


app.engine('handlebars', engine())
app.set('view engine','hanldebars')
app set('views', './views')


app.use(express.static('public'))



app.use(express.json())
app.use(express.urlencoded({ extended:true }))


app.use("/products", prodsRouter)


app.get("/", (req,res) => {
    res.redirect("/home")
})

app.get("/home", (req,res) => {
    res.render("home")
})

app.get("/ping", (req,res) => {
    res.send("Pong!")
})

app.use((req, res, next) => {
    res.render("404")
})


mongoose.connect("mongodb://localhost:27017/ecommerce")


app.listen(3000, () =>
console.log('Server running in port 3000')
)


