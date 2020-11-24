const db = firebase.firestore();
const projectForm = document.getElementById('project-form');
const btnLaunchModal = document.querySelector("#launchProjModal");
const Fireprojects = () => db.collection('projects').get();
const projectDatabase = document.getElementById('projects-database');
let editing = false;
let id = '';

let tablex = $('#projects-database').DataTable({
    "columnDefs": [{
        targets: -1,
        data: null,
        defaultContent: `<div class="text-center"><button class="btn btn-primary btn-edit" data-toggle="modal" data-target="#projectModal" >Edit</button><button class="btn btn-primary btn-delete">Delete</button></div>`
    },{
        targets : [0],
        visible : false
    },{
        targets: [6],
        render : function (data, type, full, meta) {
            return '<img src="' + data + '" style="width:150px"/>';
        }
    }]
});

const onReceiveProject = (callback) => db.collection('projects').onSnapshot(callback);
const deleteProject = id => db.collection('projects').doc(id).delete();
const updateProject = (id, updated) => db.collection('projects').doc(id).update(updated);

btnLaunchModal.addEventListener('click',(e) =>{
    projectForm.reset();
})
const saveProject = (title, descripAlfa, descripBeta, descripCharlie, category, imageurl) =>
 db.collection('projects').doc().set({
    title,
    descripAlfa,
    descripBeta,
    descripCharlie,
    category,
    imageurl
})

window.addEventListener('DOMContentLoaded', async (e) =>{
    onReceiveProject((querySnapshot) => {
        tablex.clear();
        tablex.draw();

        querySnapshot.forEach(doc => {

            const projectInfo = doc.data();
            projectInfo.id = doc.id;

            console.log(projectInfo);
            tablex.row.add([projectInfo.id, projectInfo.title, projectInfo.descripAlfa, projectInfo.descripBeta, projectInfo.descripCharlie, projectInfo.category, projectInfo.imageurl]).draw();

            $('#projects-database').on('click', 'tbody .btn-delete', function(){
                let data_row = tablex.row($(this).closest('tr')).data();
                deleteProject(data_row[0]);
            })

            $('#projects-database').on('click', 'tbody .btn-edit', function(){
                let data_row = tablex.row($(this).closest('tr')).data();
                editing = true; 

                id = data_row[0];
                projectForm['project-name'].value = data_row[1];
                projectForm['project-descripAlfa'].value = data_row[2];
                projectForm['project-descripBeta'].value = data_row[3];
                projectForm['project-descripCharlie'].value = data_row[4];
                projectForm['project-category'].value = data_row[5];
                projectForm['project-image'] = data_row[6];
                projectForm['btn-save-info'].innerText = "Update info";

            })

        
        });
    })
})

projectForm.addEventListener('submit', async e =>{
    e.preventDefault();

    const title = projectForm['project-name'];
    const descripAlfa = projectForm['project-descripAlfa'];
    const descripBeta = projectForm['project-descripBeta'];
    const descripCharlie = projectForm['project-descripCharlie'];
    const category = projectForm['project-category'];

    const fileEntry = projectForm['project-image'].files[0];

    let fileurl = null;

    if(fileEntry){
        fileurl = await uploadImage(fileEntry);
    }

    if(!editing){
        await saveProject (title.value, descripAlfa.value, descripBeta.value, descripCharlie.value, category.value, fileurl);
        $('#projectModal').modal('hide');
    }else{
        await updateProject(id, {
            title: title.value,
            descripAlfa: descripAlfa.value,
            descripBeta: descripBeta.value,
            descripCharlie: descripCharlie.value,
            category: category.value,
            imageurl: fileurl
        });

        editing = false;
        $('#projectModal').modal('hide');
        projectForm['btn-save-info'].innerText = "Save";

    }
    projectForm.reset();

    async function uploadImage(file){
        
        const ref = firebase.storage().ref();
        const name = new Date() + " - " + file.name;
        const metadata = { contentType: file.type };
        const snapshot = await ref.child(name).put(file, metadata);
        const url = await snapshot.ref.getDownloadURL();

        return url;
    }
});