function isUserConnected() {
    const user = localStorage.getItem("token");
    return (user !== null);
}

function createIcon(icons) {
    const i = document.createElement("i");
    icons.forEach(klass => {
        i.classList.add(klass);
    });
    return i;
}

function computeExpirationTime() {
    const now = Date.now();
    const oneDayInMin = (23 * 60) + 59;
    const oneDayInSec = oneDayInMin * 60;
    const onedDayInMsc = oneDayInSec * 1000;
    return new Date(now + onedDayInMsc);
}

function performLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");
    window.location = "login.html";
}

function generateLogoutButton() {
    const li = document.getElementById("login-btn");
    li.innerHTML = "";
    const text = document.createTextNode("logout");
    const a = document.createElement("a");
    a.href = "#logout"
    a.appendChild(text);
    li.appendChild(a);
    a.addEventListener("click", () => {
        performLogout();
    });
}

function runLogout(){
    if (isUserConnected()) {
        const expirationTime = localStorage.getItem("tokenExpiration");
        const now = Date.now();
        if(expirationTime <= now) {
            // Token has expired
            performLogout();
        } else {
            generateLogoutButton();
        }
    }
}

runLogout();
