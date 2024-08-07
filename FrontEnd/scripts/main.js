const defaultCategory = "Tous";
let state = {
    activeCategory: defaultCategory,
    categories: new Set(),
    works: [],
    modalState: "not-open"
};

function makeState(works) {
    const categories = works.map(work => work.category.name);
    state = {
        activeCategory: defaultCategory,
        categories: new Set(categories),
        works,
        modalState: "not-open"
    };
};

function renderWorks() {
    const container = document.querySelector("#portfolio > .gallery");
    container.innerHTML = "";
    const filteredWorks = state.works.filter(work =>
        state.activeCategory == defaultCategory || work.category.name == state.activeCategory
    );
    filteredWorks.forEach(element => {
        const figure = document.createElement("figure");
        const caption = document.createElement("figcaption");
        const title = document.createTextNode(element.title);
        const image = document.createElement("img");
        figure.id = "figure-" + element.id;
        image.alt = element.title;
        image.src = element.imageUrl;
        container.appendChild(figure);
        figure.appendChild(image);
        figure.appendChild(caption);
        caption.appendChild(title);
    });
}

function renderButton(name, container) {
    const text = document.createTextNode(name);
    const button = document.createElement("button");
    if (name == state.activeCategory) {
        button.classList.add("active");
    }
    button.addEventListener("click", () => {
        state.activeCategory = name;
        renderApplication(state);
    });
    button.appendChild(text);
    container.appendChild(button);
}

function renderCategories() {
    const container = document.querySelector("#portfolio > nav");
    container.innerHTML = "";
    renderButton(defaultCategory, container);
    state.categories.forEach(category => {
        renderButton(category, container);
    });
}

function renderApplication() {
    renderCategories();
    renderWorks();
}

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const json = await response.json();
    return json;
}


async function getData() {
    const works = await getWorks();
    makeState(works);
}

async function runGallery() {
    await getData();
    console.log(state);
    renderApplication();
}


function createModifiyButton() {
    const container = document.getElementById("my-projects");
    const button = document.createElement("button");
    const buttonText = document.createTextNode("modifier");
    const icon = createIcon(["fa-regular", "fa-pen-to-square"]);
    button.appendChild(icon);
    button.appendChild(buttonText);
    container.appendChild(button);
    return button;
}

function eraseModal() {
    const modal = document.getElementById("modal");
    if (modal === null) {
        console.log("already erased");
    } else {
        const body = document.querySelector("body");
        body.removeChild(modal);
        state.modalState = "not-open";
    }
}

function fillModalAddition(ctn) {
    alert("Not implemented yet");
}

function fillModalEdition(ctn) {
    const txt = document.createTextNode("Galerie Photo");
    const title = document.createElement("h3");
    const grid = document.createElement("div");
    grid.classList.add("picture-grid");
    state.works.forEach(function(work) {
        const div = document.createElement("div");
        div.id = "delete-" + work.id;
        const img = document.createElement("img");
        const icon = createIcon(["fa-regular", "fa-trash-can"]);
        img.src = work.imageUrl;
        div.appendChild(img);
        div.appendChild(icon);
        grid.appendChild(div);
        icon.addEventListener("click", async function() {
            const id = work.id;
            const response = await fetch("http://localhost:5678/api/works/" + id, {
                method: "DELETE",
                headers: {Authorization: 'Bearer ' + localStorage.getItem("token")}
            });
            if (response.ok) {
                console.log("Work erased");
                const container = document.querySelector("#portfolio > .gallery");
                const fig = document.getElementById("figure-" + id);
                container.removeChild(fig);
                grid.removeChild(div);
                
            } else {
                console.error("Something wrong");
                console.error(response);
            }
        });
    });
    title.appendChild(txt);
    ctn.appendChild(title);
    ctn.appendChild(grid);
}
 
function fillModalContent(ctn) {
    if(state.modalState == "updating") {
        fillModalEdition(ctn);
    } else if (state.modalState == "adding") {
        fillModalAddition(ctn);
    }
}

function createModal() {
    const body = document.querySelector("body");
    const modal = document.createElement("div");
    modal.id = "modal"
    const bg = document.createElement("div");
    const ctn = document.createElement("div");
    const nav = document.createElement("nav");
    const closeIcon = createIcon(["fa-solid", "fa-xmark"]);
    nav.appendChild(closeIcon);
    modal.appendChild(bg);
    ctn.appendChild(nav);
    modal.appendChild(ctn);
    modal.classList.add("modal");
    body.appendChild(modal);
    closeIcon.addEventListener("click", function() { eraseModal() });
    bg.addEventListener("click", function() { eraseModal() });
    fillModalContent(ctn);
    return modal;
}

function runAdmin() {
    if (isUserConnected()) {
        console.log("We are connected !");
        const button = createModifiyButton();
        button.addEventListener("click", function () {
            if (state.modalState !== "not-open") {
                console.log("already opened");

            } else {
                state.modalState = "updating";
                console.log("opening");
                const body = document.querySelector("body");
                const modal = createModal();
            }
        });
    }
}

async function run() {
    await runGallery();
    runAdmin();
}

run();
