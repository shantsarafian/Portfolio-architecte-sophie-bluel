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