
const projectForm = document.getElementById('project-form');


let btnContainer = document.getElementById("myBtnContainer");
let btns = btnContainer.getElementsByClassName("btn-dashboard");

for (let i = 0; i < btns.length; i++){
    btns[i].addEventListener("click", function (){
        let current = document.getElementsByClassName("btn-active");
        current[0].className = current[0].className.replace(" btn-active", "");
        this.className += " btn-active";
    })
}

document.getElementById("btn-all").onclick = function (){
    let all = document.querySelectorAll(".project");
    for(let i = 0; i < all.length; i++){
        all[i].style.display = "inline-block";
    }
};

document.getElementById("btn-videogame").onclick = function (){
    let all = document.querySelectorAll(".project");
    for(let i = 0; i < all.length; i++){
        if(all[i].classList.contains("videogameElem")){
            all[i].style.display = "inline-block";
        }
        else{
            all[i].style.display = "none";
        }
    }
}

document.getElementById("btn-videoedit").onclick = function (){
    let all = document.querySelectorAll(".project");
    for(let i = 0; i < all.length; i++){
        if(all[i].classList.contains("videoeditElem")){
            all[i].style.display = "inline-block";
        }
        else{
            all[i].style.display = "none";
        }
    }
}

document.getElementById("btn-3dmodel").onclick = function (){
    let all = document.querySelectorAll(".project");
    for(let i = 0; i < all.length; i++){
        if(all[i].classList.contains("3dmodelElem")){
            all[i].style.display = "inline-block";
        }
        else{
            all[i].style.display = "none";
        }
    }
}

document.getElementById("btn-art").onclick = function (){
    console.log("PREUBA");
    let all = document.querySelectorAll(".project");
    for(let i = 0; i < all.length; i++){
        if(all[i].classList.contains("artElem")){
            all[i].style.display = "inline-block";
        }
        else{
            all[i].style.display = "none";
        }
    }
}

const onReceiveProject = (callback) => db.collection('projects').onSnapshot(callback);

window.addEventListener('DOMContentLoaded', async (e) =>{
    onReceiveProject((querySnapshot) => {
        const projContain = document.getElementById("project-container");
        projContain.innerHTML = '';

        querySnapshot.forEach(doc => {

            const projectInfo = doc.data();
            projectInfo.id = doc.id;

            let categorySep = null;
            switch (projectInfo.category){
                case "Videogame":
                    categorySep = "videogameElem";
                    break;
                case "3D-Model":
                    categorySep = "3dmodelElem";
                    break;
                case "Video-Editing":
                    categorySep = "videoeditElem";
                    break;
                case "Art":
                    categorySep = "artElem";
            }
            console.log(projectInfo);

            projContain.innerHTML += `<div class="card text-center ${categorySep} project">
            <img class="card-img-top" src="${projectInfo.imageurl}" alt="ifeelter" />
            <div class="card-body">
              <h5 class="card-title"> ${projectInfo.title} </h5>
              <p class="card-text">
              ${projectInfo.descripAlfa}
              </p>
              <a href="" class="btn btn-primary">Let's see where this goes</a>
            </div>
          </div>`;
            console.log(projectInfo);      
        });
    })
})