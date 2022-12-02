document.addEventListener("DOMContentLoaded", ()=>{
    rocketNavigation()
    typePresentation()
    techGitTotal()
})
function rocketNavigation(){
    document.addEventListener("scroll", ()=>{
        const rocketImg = document.querySelector(".rocket_nav-scroll")
        let currentScrollPos = String(parseInt(window.scrollY) + 270)
        rocketImg.style.top = currentScrollPos + "px"
    })
}
function typePresentation(){
    let H1Presentation = document.querySelector("#type-presentation")
    H1Presentation.innerHTML = ""
    typeLetters("Olá meu nome é Augusto", H1Presentation, true).then(()=>{
        typeLetters("Sou Desenvolvedor Front-End", H1Presentation, true).then(()=>{
            typeLetters("e Web Designer :)", H1Presentation, true).then(()=>{
                typeLetters("Olá meu nome é Augusto", H1Presentation)
            })
        })
    })

}
function typeLetters(string, element, goBack=false){
    return new Promise(response=>{
        let wordsFactored = string.split("")
        setTimeout(()=>{
            element.innerHTML = ""
            wordsFactored.forEach((word, current)=>{
                setTimeout(()=>{
                    element.innerHTML += word
                }, 100 * current)
            })
        })
        if(goBack){
            setTimeout(()=>{
                wordsFactored.forEach((word, current)=>{
                    setTimeout(()=>{
                        wordsFactored.pop()
                        let wordsRefactored = wordsFactored.join("")
                        element.innerHTML = wordsRefactored
                    }, 100 * current)
                })
            }, 4600)
            setTimeout(response, 7400)
        }
    })
}
//disappear - desaparecer
//appear - aparecer

const moveBoxes = {
    disappear: (containerSelect, effect)=>{
        let container = document.querySelector(containerSelect)
        if(effect === "default"){
            container.classList.add("opacity-0")
            setTimeout(()=> container.remove(), 400)
        }
        if(effect === "right"){
            container.classList.add("translate-disappear-right")
            setTimeout(()=> container.remove(), 400)
        }
        if(effect === "left"){
            container.classList.add("translate-disappear-left")
            setTimeout(()=> container.remove(), 400)
        }
        if(effect === "up"){
            container.classList.add("translate-disappear-up")
            setTimeout(()=> container.remove(), 400)
        }
    }
}
function openPopUpTechs(techId){
    let techSelected = dbTechsInfosCollection.filter(tech=> tech.id.toLowerCase() === techId.toLowerCase())[0]
    
    let div = document.createElement("div")
    let h2 = document.createElement("h2")
    let p = document.createElement("p")
    let article = document.createElement("article")
    let button = document.createElement("button")
    let a = document.createElement("a")

    div.classList.add("popUp_infoTech", "translate-disappear-up")
    h2.innerHTML = `Mas o'que é ${techSelected.name}?`
    p.innerHTML = `${techSelected.infos}`
    button.innerHTML = "Fechar"
    button.addEventListener("click", ()=>{
        document.body.classList.remove("block-scrollBody")
        moveBoxes.disappear(".popUp_infoTech", "up")
    })
    a.innerHTML = "Saiba mais"

    document.body.appendChild(div)
    div.appendChild(h2)
    div.appendChild(p)
    div.appendChild(article)
    article.appendChild(button)
    a.target = "_black"
    a.href = techSelected.link
    article.appendChild(a)

    setTimeout(()=>  document.querySelector(".popUp_infoTech").classList.remove("translate-disappear-up"), 100)
}

function handlePerfilGit(api){
    return new Promise((resolve, reject)=>{
        fetch(api).then(res=>{
            res.json().then(json=>resolve(json))
        }).catch(err=> reject(err))
    })
}
function handleRepositoryGit(id){
    return new Promise((resolve, reject)=>{
        handlePerfilGit("https://api.github.com/users/AugustoGitH/repos").then(json=>{
            let repSelect = json.filter(rep=> rep.id === id)[0]
            resolve({
                link: repSelect.svn_url
            })
        })
    })
}
async function techGitTotal(){
    let techsReps = await  handlePerfilGit("https://api.github.com/users/AugustoGitH/repos").then(json => json.map(rep=> rep.languages_url))
    let funTest = new Promise((resolve, reject)=>{
        let techs = []
        techsReps.forEach(async (apiRep)=>{
            let repTech = await fetch(apiRep).then(res=> res.json().then(json=> json))
            if(Object.keys(repTech).length > 0) return techs.push(repTech)
        })
        setTimeout(()=>resolve(techs), 2000)

    })
    funTest.then(repsTech=>{
        let returnValuesTechs = (tech)=>{
            return repsTech.map(repTech=> repTech[tech] === undefined ? 0 : repTech[tech])
            .reduce((currentValue, prevValue)=> currentValue + prevValue)
        }
        let techsValueDec = {
            JavaScript: returnValuesTechs("JavaScript"),
            HTML: returnValuesTechs("HTML"),
            CSS: returnValuesTechs("CSS"),
            Sass: returnValuesTechs("Sass"),
            EJS: returnValuesTechs("EJS"),
        }
        let convertPercent = () =>{
            let techsValuePercent = {}
            let valueTotal = 0
            for(let techKey in techsValueDec) valueTotal += techsValueDec[techKey]
            for(let techKey in techsValueDec) techsValuePercent[techKey] = Math.round((techsValueDec[techKey] * 100) / valueTotal)

            return techsValuePercent

        }
        let loop = true
        document.addEventListener("scroll", ()=>{
            let positionContainer = document.querySelector(".estatics_techs-used").getBoundingClientRect().top - 350
            if(positionContainer < 250 && positionContainer > -250) {
                if(loop){
                    setTimeout(()=> iniciarRenderTechs(convertPercent()), 1000)  
                    loop = false
                }
                
            }
        })
    })

    
}
function iniciarRenderTechs(techsObj){
    for(let tech in techsObj){
        let containerTech = document.querySelector(`#${tech}`)
        let legendPercent = containerTech.querySelector(".percent_legend")
        let barProgressTech = containerTech.querySelector(".bar_percent-tech")

        document.querySelector(`#${tech}-barTechs-total`).addEventListener("mouseover", ()=> document.querySelector(`#${tech}-barTechs-total`).innerHTML += `<span class="legend_tech-hover">${tech}: ${techsObj[tech]}%</span>`)
        document.querySelector(`#${tech}-barTechs-total`).addEventListener("mouseout", ()=> document.querySelector(`.legend_tech-hover`).remove())
        barProgressTech.classList.remove("boll_init-tech")
        for(let i = 0; i <= techsObj[tech]; i++){
            setTimeout(()=>{
                document.querySelector(`#${tech}-barTechs-total`).style.width = i + "%"
                legendPercent.innerHTML = i + "%"
                barProgressTech.style.width = i + "%"
            }, 50 * i)
        }
    }

}





document.addEventListener("DOMContentLoaded", ()=>{
    handleProjectsApi().then(projects=>{
        clickEventFiltering(projects)
        refreshProjectsScreen(projects, true)
        document.querySelector(".popup_loop").remove()
        document.body.classList.remove("block-overflow")
    })
})

function openOnStartProjects(){
    let buttonWhereSonic = document.querySelector(".sonic_top-button")
    console.log(buttonWhereSonic)
}

function clickEventFiltering(collection){
    let filteringButtons = document.querySelectorAll(".filter-button")
    filteringButtons.forEach(button=>{
        button.addEventListener("click", event=> {
            filterProjectBoxes(collection, event.target.id)
            updatePosSonic(event.target)
        })
    })
}

function filterProjectBoxes(collection, classe){
    let refinedClass = classe.replace(/_/g, " ").toLowerCase()

    let refinedProjects = collection.filter(project=>{
        return project.classe.toLowerCase() === refinedClass && project.classe.toLowerCase() !== "todos"
    })
    if(refinedClass === "todos") return refreshProjectsScreen(collection, true)
    else return refreshProjectsScreen(refinedProjects)
}   
function orderProjects(projects){
    let projectFavorites = projects.filter(project=> project.favorite)
    let projectDefaults = projects.filter(project=> !project.favorite )
    let orderProjects = projectFavorites.concat(projectDefaults)
    return orderProjects
}
function refreshProjectsScreen(projects , todos=false){
    verify_buttonVisibility(projects)
    clearProjectsPopUpScreen()
    clearProjectsScreen()
    if(todos){
        orderProjects(projects).forEach(project=> createBlockProject(project))
    }else{
        projects.forEach(project=> createBlockProject(project))
    }
    document.querySelectorAll(".block_project").forEach((projectB, current)=>{
        setTimeout(()=>{
            projectB.classList.remove("translate-disappear-left")
        }, 200 * current)
    })
    addEventClickProjectsPopUp(projects)
}

function clearProjectsPopUpScreen(){
    if(document.querySelectorAll(".pop_project")){
        document.querySelectorAll(".pop_project").forEach(pop=>{
            pop.remove()
        })
    }
}

function updatePosSonic(button){
    let buttonsFilterAll = document.querySelectorAll(".filter-button")
    buttonsFilterAll.forEach(buttonFilter=> buttonFilter.classList.remove("sonic_top-button"))
    button.classList.add("sonic_top-button")
}

function clearProjectsScreen(){
    let projectsOnScreen = document.querySelectorAll(".block_project") ? document.querySelectorAll(".block_project") : []
    projectsOnScreen.forEach(project=> project.remove())
}

function createBlockProject(project){
    let blocks_project = document.querySelector(".blocks_project-container")
    let colorBorder = "block-border-" + project.color.replace(/ /g, "-").toLowerCase()
    let blockProjectModel = `
        <div id="${project._id}" class="block_project ${colorBorder} translate-disappear-left" >
            <img src="${project.url_image}">
        </div>
    `
    blocks_project.innerHTML += blockProjectModel
}



function addEventClickProjectsPopUp(projects){
    document.querySelectorAll(".block_project").forEach(projectEl=>{
        projectEl.addEventListener("click", event=>{
            let projectSelected = projects.filter(project=> project._id === event.target.id)[0]
            document.querySelectorAll(".pop_project").forEach(pop=> pop.remove())
            createPopUpProjectsInfos(projectSelected)
        })
    })
}
function createPopUpProjectsInfos(project){
    let buttonStatus = ""
    if(project.url) buttonStatus = "Visitar"
    if(project.video.url_video) buttonStatus = "Assistir"
    if(!project.url && !project.video.url_video) buttonStatus = "Sem link"
    let carregarTechs = (techs)=>{
        let resultHTML = ""
        techs.forEach(tech=> resultHTML += tech)
        return resultHTML
    }

    
    let pop_project = document.createElement("div")
    let pop_content = document.createElement("div")
    let fecha_pop = document.createElement("button")
    let article = document.createElement("article")
    let img = document.createElement("img")
    let h1 = document.createElement("h1")
    let containerButtons = document.createElement("nav")
    let hiperLinkAccess = document.createElement("a")
    let accessLinkButtonGit = document.createElement("a")
    let ul = document.createElement("ul")

    pop_project.classList.add("pop_project", "translate-disappear-right")
    pop_content.classList.add("pop_proj-content")
    fecha_pop.classList.add("fecha_pop")
    hiperLinkAccess.classList.add("hiperlink-access")
    accessLinkButtonGit.classList.add("accessLinkButton")

    pop_project.appendChild(pop_content)
    pop_content.appendChild(fecha_pop)
    fecha_pop.innerHTML = "<i class='bx bx-right-arrow-alt'></i>"
    pop_content.appendChild(article)
    pop_content.appendChild(img)
    article.appendChild(h1)
    article.appendChild(containerButtons)
    containerButtons.appendChild(hiperLinkAccess)
    accessLinkButtonGit.innerHTML = "<i class='bx bx-code-alt' ></i>"
    containerButtons.appendChild(accessLinkButtonGit)
    article.appendChild(ul)

    fecha_pop.addEventListener("click", ()=> {
        pop_project.classList.add("translate-disappear-right")
        setTimeout(()=> document.body.removeChild(pop_project), 200)
    })


    hiperLinkAccess.innerHTML = buttonStatus

    if(buttonStatus === "Visitar"){
        hiperLinkAccess.href = project.url
        hiperLinkAccess.target = "_blank"
    }
    if(buttonStatus === "Assistir"){
        hiperLinkAccess.addEventListener("click", ()=>{
            abrirVideoRep(project.video.url_video)
        })
    }
    if(project.id_github > 1){
        handleRepositoryGit(project.id_github).then(rep=> {
            accessLinkButtonGit.href = rep.link
            accessLinkButtonGit.target = "_blank"
        })
    }


    h1.innerHTML = project.title
    img.src = "public/assets/Persons_Gif/panda.gif"
    ul.innerHTML = carregarTechs(project.techs)

    document.body.appendChild(pop_project)
    setTimeout(()=> pop_project.classList.remove("translate-disappear-right"), 100)

}


function abrirVideoRep(urlVideo){
    moveBoxes.disappear(".pop_project", "opacity-0")
    let video_port = document.createElement("div")
    video_port.classList.add("video_port")
    document.body.appendChild(video_port)
    video_port.innerHTML = `<iframe id="iframe" src=${urlVideo} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    let buttonSair = document.createElement("p")
    buttonSair.classList.add("buttonSairIf")
    buttonSair.innerHTML = "Sair"
    video_port.appendChild(buttonSair)
    buttonSair.addEventListener("click", ()=> video_port.remove())
}













function handleProjectsApi(){
    return new Promise((resolve, reject)=>{
        fetch("/admin/api/accessProjects").then(res=>{
            res.json().then(json=>{
                resolve(json)
            })
        })
    })
}





function visibilityProjects(el){
    let containerProjects = document.querySelector(".blocks_project-container")
    if(containerProjects.classList.contains("visible-none")){
        containerProjects.classList.remove("visible-none")
        el.querySelector(".visibility_display").innerHTML = "Ver menos"
        el.querySelector(".icon_indication").classList.add("rotateArrowUp")
    }else{
        containerProjects.classList.add("visible-none")
        el.querySelector(".visibility_display").innerHTML = "Ver mais"
        el.querySelector(".icon_indication").classList.remove("rotateArrowUp")
    }
}
function verify_buttonVisibility(array){
    let verMaisButton = document.querySelector(".indicator_button-visible")
    let containerPort = document.querySelector(".blocks_project-container")
    if(array.length < 4){
        verMaisButton.style.display = "none"
        containerPort.classList.remove("visible-none")
    }else{
        verMaisButton.style.display = "flex"
        containerPort.classList.add("visible-none")
    }
}