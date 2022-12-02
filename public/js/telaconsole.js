const campoOptions_project = document.querySelector(".options-classe--input")
const campoOptions_colorProject = document.querySelector(".options-colors--input")
const campoOptions_typeProject = document.querySelector(".options-typeProject--input")
const campoOptions_techsProject = document.querySelector(".options-techs--input")


function currentOptions(campo, markClass, most=false){
    campo.querySelectorAll(".options_blocks li").forEach((option, current, options)=>{
        option.addEventListener("click", ev=>{
            if(!most){
                options.forEach(optionR=> optionR.classList.remove(markClass))
            } 
            ev.target.classList.toggle(markClass)
            ev.target.classList.toggle("mark-check")
        })
    })
}
function currentOptionsAddInput(campo){
    campo.querySelectorAll(".options_blocks li button").forEach((button, current, buttons)=>{
        button.addEventListener("click", ev=>{
            let button = ev.target
            let inputContainer = button.parentNode.querySelector(".input-ocult-option")
            let input = button.parentNode.querySelector(".input-ocult-option input")
            ev.preventDefault()

            buttons.forEach(buttonR=>{
                buttonR.classList.remove("mark-type-option")
                let inputContainer = buttonR.parentNode.querySelector(".input-ocult-option")
                let input = buttonR.parentNode.querySelector(".input-ocult-option input")
                setTimeout(()=> inputContainer.classList.add("ocult-input"), 200)
                input.required = false
                input.value = ""
            })
            button.classList.add("mark-type-option")
            setTimeout(()=> inputContainer.classList.remove("ocult-input"), 200)
            input.required = true
            
        })
    })
}

function handleInputFileImage(){
    let label = document.querySelector(".input_image-label")
    label.addEventListener("change", ev=>{
        let input_value = ev.target.files[0]
        if(input_value){
            let reader = new FileReader()
            reader.addEventListener("load", ev=> {
                let container = document.querySelector(".container_sample-image")
                let modelContImage = `
                    <div class="sample_image">
                        <img src="${ev.target.result}">
                    </div>
                `
                container.innerHTML = modelContImage
            })
            reader.readAsDataURL(input_value)
        }
    })
}

document.querySelector("#submit-form").addEventListener("click", ev=> validationForm(ev) )
function validationForm(event){
    let returnResultsCheckboxes = (checkboxes)=>{
        let objBoxes = {}
        checkboxes.forEach(checkbox=>{
            objBoxes[checkbox.id] = Array.from(checkbox.querySelectorAll(".options_blocks li"))
            .filter(option=> option.classList.contains("mark-check"))
            .map(option=> option.innerHTML)
        })
        return objBoxes
    }
    event.preventDefault()
    let inputsDefaults = Array.from(document.querySelectorAll("form input"))
    let inputsValid = inputsDefaults.filter(input=> input.required === true)
    let inputsValidEmpty = 0
    inputsValid.forEach(input => !input.value ?  inputsValidEmpty++ : 0)


    let checkboxes =  Array.from(document.querySelectorAll(".checkbox"))
    let checkBoxesEmpty = 0
    let checkBoxesValues = returnResultsCheckboxes(checkboxes)
    for(let key in checkBoxesValues) if(checkBoxesValues[key].length === 0) checkBoxesEmpty++

    if((checkBoxesEmpty + inputsValidEmpty) !== 0) return alert("Algum campo vazio! Complete-o e tente novamente!")
    sendProjectDataCreation(checkBoxesValues, inputsValid)
}


document.addEventListener("DOMContentLoaded", ()=>{
    currentOptions(campoOptions_project, "mark-option")
    currentOptions(campoOptions_colorProject, "mark-color-option")
    currentOptionsAddInput(campoOptions_typeProject)
    currentOptions(campoOptions_techsProject, "mark-tech-option", true)
    handleInputFileImage()
})




function sendProjectDataCreation(checkboxes, inputsValid){
    const nameProject = document.querySelector("#name-project").value
    const idGHProject = document.querySelector("#id-github").value
    const urlImage = document.querySelector(".sample_image img").src

    let verifyValueInputs = (array, id)=>{
        if(array.filter(input=> input.id === id)){
            return array.filter(input=> input.id === id)[0] 
        }else{
            return false
        }
       
    }

    const inputVideoProject = verifyValueInputs(inputsValid, "input_link-video")
    const inputVideoProjectSiteProject = verifyValueInputs(inputsValid, "input_link-site")
    let valueLinkVideo = inputVideoProject ? inputVideoProject.value : undefined
    let valueLinkSite = inputVideoProjectSiteProject ? inputVideoProjectSiteProject.value : undefined

    const typeProject = checkboxes.check_classes
    const colorProject = checkboxes.check_colors
    const techsProject = checkboxes.check_techs
   
    let options = {
        method: "POST",
        headers: new Headers({"content-type": "application/json"}),
        body: JSON.stringify({
            title: nameProject,
            url_image: urlImage,
            classe: typeProject,
            color: colorProject,
            url: valueLinkSite,
            video: {
                url_video: valueLinkVideo
            },
            techs: techsProject,
            id_github: idGHProject
        })
    }
    fetch("/admin/api/createProject", options).then(res=>{
        res.json().then(json=>{
            console.log(json)
            if(json.status){
                alert(json.message)
                location.reload()
            }else return alert(json.message)
        })
    })
}   





document.addEventListener("DOMContentLoaded", ()=>{
    showProjectsDb()

})

function showProjectsDb(){
    fetch("/admin/api/accessProjects").then(res=>{
        res.json().then(json=>{
            createProjectHTML(json)
            document.querySelector(".popup_loop").remove()
            document.body.classList.remove("block-overflow")
        })
    })
}
function createProjectHTML(projects){
    let returnTechsProject = (project)=>{
        let techsInnerHTML = ""
        project.techs.forEach(tech=>{
            techsInnerHTML += tech
        })
        return techsInnerHTML
    }
    let projectsTotal = ""
    projects.forEach(project=>{
        projectsTotal += `
        <li id="${project._id}" class="project">
            <div class="img_project-container">
                <img src="${project.url_image}">
            </div>
            <div class="informacion_project-container">
                <p><strong>${project.title.toUpperCase()}</strong></p>
                <p>${project.classe}</p>
                <p>Cor da caixa: ${project.color}</p>
                <p>Url Video: ${project.video.url_video ? `<a href="${project.video.url_video}">${project.video.url_video}</a>` : "indefinido"}</p>
                <p>Url Site: ${project.url ?  `<a href="${project.url}">${project.url}</a>` : "indefinido"}</p>
                <ul>
                    ${returnTechsProject(project)}
                </ul>
            </div>
            <i class='bx bx-trash-alt icon_trash-project' onclick="removeProjectDb('${project._id}')" ></i>
            <i class='bx bxs-star checkbox-favorite ${project.favorite ? "project-favorite-mark": ""}' onclick="favoriteProject('${project._id}', this)"></i>
        </li>
        `
    })

    document.querySelector(".projects_management-list").innerHTML = projectsTotal

}

function removeProjectDb(idProject){
    let options = {
        method: "DELETE",
        headers: new Headers({"content-type": "application/json"}),
        body: JSON.stringify({
            idProject
        })
    }
    fetch("/admin/api/removeProject", options).then(res=>{
        res.json().then(json=>{
            if(json.status){
                location.reload()
            }else{
                alert(json.message)
            }
        })
    })
}
function favoriteProject(idProject, button){
    let methodFav = ""
    if(button.classList.contains("project-favorite-mark")){
        methodFav = "DRAIN"
        button.classList.remove("project-favorite-mark")
    }else{
        methodFav = "FAVORITE"
        button.classList.add("project-favorite-mark")
    }
    let options = {
        method: "POST",
        headers: new Headers({"content-type": "application/json"}),
        body: JSON.stringify({
            idProject,
            method: methodFav
        })
    }
    fetch("/admin/api/favorite-project", options).then(res=>{ })
}