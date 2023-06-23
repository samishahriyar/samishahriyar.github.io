titledict = {
    '': 'Welcome to samishahriyar.github.io!',
    '/': 'Welcome to samishahriyar.github.io!',
    'aboutme': 'Know about me!!',
    'findme': 'Find me out on Internet'
}


function route(url){
    document.title = titledict[url]
    history.pushState(url, titledict[url], url)
    if(url=="/"){
    fetcher("home.html")
    document.querySelectorAll(".underline").forEach((e) => e.style.width = "0")
    }else{
        fetcher(url+".html")
        if(history.state=="aboutme"){
            document.querySelector("#aboutme .underline").style.width = "110%"
            document.querySelector("#findme .underline").style.width = "0"
        }else if(history.state=="findme"){
            document.querySelector("#aboutme .underline").style.width = "0"
            document.querySelector("#findme .underline").style.width = "110%"
        }
    }
}


if(history.state==="/"||history.state===null){
    fetcher("home.html")
}else{
    route(history.state)
}


// document.querySelectorAll("#nav #links a").forEach(function(e){
//     e.addEventListener("mouseover", function(){
//         e.querySelector(".underline").style.width = "110%"
//     })
//     e.addEventListener("mouseleave", function(){
//         e.querySelector(".underline").style.width = "0"
//     })
// })



function fetcher(link){
    fetch(link)
    .then((e) => e.text())
    .then((k) => document.getElementById("main").innerHTML = k)
}
