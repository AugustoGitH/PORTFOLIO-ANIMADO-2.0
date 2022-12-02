require("dotenv").config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 3000
const cookieParser = require('cookie-parser')

const routerAccessProjects = require("./routers/accessProjectsRouter")

const authenticationController = require("./controllers/authenticationController")

const accessProjectsController = require("../controllers/accessProjectsControllers")
app.use("/public", express.static("public"))
app.use(cookieParser())

app.use(bodyParser.json({limit: '99999mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '99999mb', extended: true}))

app.use("/admin/api", routerAccessProjects)

app.set("view engine", "ejs")


app.get("/", (req, res)=>{
    res.render("tela_principal")
})
app.get("/admin/authentication", (req, res)=>{
    res.render("tela_login")
})
app.get("/admin/console", authenticationController.authentication_admin, (req, res)=>{
    res.render("tela_console")
})

mongoose.connect(process.env.MONGO_CONNECTION_URL, (err)=> err ? console.log(err) : console.log("------------> BANCO DE DADOS CARREGADO"))

app.listen(PORT, ()=>{
    console.log("Servidor rodando na porta " + PORT)
})
