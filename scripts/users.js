//SIGN UP
const signupForm = document.querySelector("#signup-form");
const navUser = document.querySelector("#nav-username");
const navSignUp = document.querySelector("#nav-signUp");
const navSignIn = document.querySelector("#nav-signIn");
const navLogout = document.querySelector("#nav-logout");
const navCRUD = document.querySelector("#navCrud");
const btnCRUD = document.querySelector("#btnCRUD");

const onGetUsuarios = (callback) => db.collection('users').onSnapshot(callback);
const getUser = (id) => db2.collection("users").doc(id).get();


signupForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    
    const username = document.querySelector("#signup-username").value;
    const email= document.querySelector("#signup-email").value;
    const password = document.querySelector("#signup-password").value;
    
    console.log(email, password);
    
    db2.collection('users').doc(email).set({
        username: username,
        email : email,
        password : password,
        isAdmin : false,
    })

    auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            signupForm.reset();
            $('#signupModal').modal('hide');
            console.log("Signed Up");
        }).catch(function(error){alert("Email already in use.")})
        .signInWithEmailAndPassword(email, password)
})

//SIGNIN
const loginForm = document.querySelector("#login-form");

loginForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    
    const email= document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;
    
    console.log(email, password);

    auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            signupForm.reset();
            $('#signinModal').modal('hide');            
            console.log("Signed In");
        }).catch(function(error){alert("Email/Password incorrect")});
})

//LOGOUT
const logout = document.querySelector("#nav-logout");

logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("Logout");
        navCRUD.style.display = "none";
        btnCRUD.style.display = "none";
    })
})

//CHANGE
 auth.onAuthStateChanged(async user =>{

     if(user){
        let boolAdmin = await adminIs(user.email);
        let userName = await userIs(user.email);
        if(boolAdmin){
            navCRUD.style.display = "block";
            btnCRUD.style.display = "block";
            console.log(user.uid);
        }
        else{
            navCRUD.style.display = "none";
            btnCRUD.style.display = "none";
        }
         navUser.innerHTML = `${userName}`;
         navUser.style.display = "block";
         navSignIn.style.display = "none";
         navSignUp.style.display = "none";
         navLogout.style.display = "block";
         console.log("Signed IN");
     }
     else{
         console.log("Signed OUT");
         navUser.style.display = "none";
         navSignIn.style.display = "block";
         navSignUp.style.display = "block";
         navLogout.style.display = "none";
     }
 })

//  SEE ADMIN
 async function adminIs(id){
     const persona = await getUser(id);
     if(persona.data().isAdmin)
        return true;
    else   
        return false;
 }

 //  SEE USERNAME
 async function userIs(id){
    const persona = await getUser(id);
    return persona.data().username;
}

