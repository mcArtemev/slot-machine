const signUpGhostButton = document.getElementById('signUpGhost');
const signInGhostButton = document.getElementById('signInGhost');
const loginBody = document.getElementById("loginBody");
const loginForm = document.getElementById('loginForm');

const nameFieldSignUp = document.getElementById("nameSignUp")
const emailFieldSignUp = document.getElementById("emailSignUp");
const passwordFieldSignUp = document.getElementById("passwordSignUp");

const emailFieldSignIn = document.getElementById("userEmail");
const passwordFieldSignIn = document.getElementById("userPassword");

const profile = document.getElementById("profile");

const balance = 0

signUpGhostButton.addEventListener('click', () => {
	loginForm.classList.add("right-panel-active");
});

signInGhostButton.addEventListener('click', () => {
	loginForm.classList.remove("right-panel-active");
});

function singUpUser() {
    const userName = nameFieldSignUp.value;
    const userEmail = emailFieldSignUp.value;
    const userPassword = passwordFieldSignUp.value;
    if (userName != "" || userEmail != "" || userPassword != "") {
        saveUserDataInLocalStorage(userName, userEmail, userPassword)
        console.log(userName, userEmail, userPassword);
    }
}

function saveUserDataInLocalStorage(name, email, password) {
    let userData = {"name": name, "email": email, "password": password, "balance": Number(balance)}
    localStorage.setItem("user", JSON.stringify(userData))
}

function loginUser() {
    const userEmail = emailFieldSignIn.value;
    const userPassword = passwordFieldSignIn.value;

    if (userEmail != "" || userPassword != "") {
        checkUserInDB(userEmail, userPassword);
        profile.innerText = JSON.parse(localStorage.getItem("user")).name;
    }
    
}

function checkUserInDB(userEmail, userPassword) {
    let userData = JSON.parse(localStorage.getItem("user"));
    if (userEmail === userData.email && userPassword === userData.password) {
        document.querySelector(".site-wrapper").hidden = false;
        loginBody.hidden = true;
    }
}