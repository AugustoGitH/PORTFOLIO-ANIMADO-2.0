function visiblePassword(icon){
    let input = icon.parentNode.querySelector("input")
    input.type === "password" ? input.type = "text" : input.type = "password"
}

let submit_form = document.querySelector(".submit_form")
submit_form.addEventListener("click", ev=>{
    let username = document.querySelector("#username").value
    let password = document.querySelector("#password").value

    ev.preventDefault()
    let options = {
        method: "POST",
        headers: new Headers({"content-type": "application/json"}),
        body: JSON.stringify({
            username, password
        })
    }
    fetch("/admin/api/login", options).then(response=>{
        response.json().then(json=>{
            if(json.access) return location.href="/admin/console"
            
        })
    })
})