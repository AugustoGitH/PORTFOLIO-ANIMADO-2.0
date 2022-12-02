const Project = require("../models/projetos")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


module.exports = {
    login: (req, res)=>{
        let username = req.body.username.toLowerCase()
        let password = req.body.password

        let passAndUserMatch = bcrypt.compareSync(password, process.env.passwordAdmin)
        if(!passAndUserMatch && username !== process.env.usernameAdmin){
            return res.status(401).send({message: "Acesso negado!"})
        }
        const tokenJWT = jwt.sign({usernameAdmin: process.env.usernameAdmin}, process.env.TOKEN_SECRET)
        res.cookie("authorizationToken", tokenJWT, {
            secure: true,
            httpOnly: true,
        })
        res.status(200).send({message: "Acesso autorizado!", access: true})
    },
    createProject: (req, res)=>{

        let {title, url_image, classe, color, url, video, techs, id_github} = req.body

        const project = new Project({
            title, url_image,
            classe: classe[0],
            color: color[0],
            url, video, techs, id_github
        })
        project.save().then(project=>{
            return res.send({message: "Projeto salvo com sucesso!", status: true})
        }).catch(err=>{
            return res.send({message: "Erro ao criar projeto!", status: false})
        })
    },
    accessProjects: async(req, res)=>{
        let projects = await Project.find({})
        res.send(projects)
    },
    removeProject: (req, res)=>{
        Project.remove({_id: req.body.idProject}).then(status=>{
            res.send({message: "Projeto apagado com sucesso!", status: true})
        }).catch(err=>{
            console.log(err)
            res.send({message: "Ocorreu um erro ao apagar o projeto!", status: false})
        })
    },
    favoriteProject: (req, res)=>{
        let projectSelectedId = req.body.idProject
        let method = req.body.method
        if(method === "DRAIN"){
            Project.updateOne({_id: projectSelectedId}, {favorite: false}).then(status=>{
                res.send({message: "Projeto desfavoritado!"})
            })
        }
        if(method === "FAVORITE"){
            Project.updateOne({_id: projectSelectedId}, {favorite: true}).then(status=>{
                res.send({message: "Projeto favoritado!"})
            })
        }
    }
}