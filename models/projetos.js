const mongoose = require("mongoose")
const projetoSchema = new mongoose.Schema({
    title: {type: String, required: true}, 
    url_image: {type: String, required: true},
    classe: {type: String, required: true},
    color: {type: String, required: true},
    url: {type: String, default: ""},
    video: {type: Object, default: {
        activated: false,
        url_video: undefined
    }},
    techs: {type: Array, required: true, default: []},
    id_github: {type: Number, default: undefined},
    favorite: {type: Boolean, default: false}

})

module.exports = mongoose.model("Projeto", projetoSchema)