const express = require("express")
const router = express.Router()
const accessProjectsController = require("../controllers/accessProjectsControllers")
const authenticationController = require("../controllers/authenticationController")

router.post("/login", accessProjectsController.login)
router.post("/createProject", authenticationController.authentication_admin, accessProjectsController.createProject)
router.get("/accessProjects", accessProjectsController.accessProjects)
router.delete("/removeProject", authenticationController.authentication_admin, accessProjectsController.removeProject)
router.post("/favorite-project", accessProjectsController.favoriteProject)


module.exports = router
