function check(email, password){
    return !(email ==  "" || password == "");
    
}

function displayError(message){
    const error = document.getElementById("error");
    error.innerText = message;
}

function clearError(){
    displayError("");
}

async function connect(email, password) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    return await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: JSON.stringify({email, password}),
        headers
    });
}

function storeConnectionInformation(userId, token) {
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
}

async function run(){
    const connectionButton = document.getElementById("connect");
    connectionButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const email = emailInput.value;
        const password = passwordInput.value;
        if(check(email, password)){
            const response = await connect(email, password);
            if (response.status == 200) {
                clearError();
                const json = await response.json();
                const userId = json.userId; 
                const token = json.token;
                storeConnectionInformation(userId, token);
                window.location = "index.html";
            } else {
                const json = await response.json();
                const message = json.message;
                displayError("Une erreur est survenue : " + message);
            }
        }
        else {
            displayError("Informations erronnées");
        }
    });
}

if (isUserConnected()) {
    displayError("Vous êtes déjà connecté !");
    const form = document.getElementById("login-form");
    const container = document.getElementById("login");
    container.removeChild(form);
} else {
    run();
}
