const defaultCategory = "Tous";
let state = {
    activeCategory: defaultCategory,
    categories: new Set(),
    works: [],
    modalState: "not-open",
    realCategories: []
};

function makeState(works, realCategories) {
    const categories = works.map(work => work.category.name);
    state = {
        activeCategory: defaultCategory,
        categories: new Set(categories),
        works,
        modalState: "not-open",
        realCategories
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

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const json = await response.json();
    return json;
}


async function getData() {
    const works = await getWorks();
    const categories = await getCategories();
    makeState(works, categories);
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

function createInput(id, title, ctn) {
    const txt = document.createTextNode(title);
    const label = document.createElement("label");
    label.appendChild(txt);
    label.htmlFor = id;
    const input = document.createElement("input");
    input.id = id;
    input.name = id;
    ctn.appendChild(label);
    ctn.appendChild(input);
    return input;
}

function createList(id, title, ctn) {
    const txt = document.createTextNode(title);
    const label = document.createElement("label");
    label.appendChild(txt);
    label.htmlFor = id;
    const input = document.createElement("select");
    input.id = id;
    input.name = id;
    state.realCategories.forEach((category) => {
        const optn = document.createElement("option");
        optn.value = category.id;
        optn.appendChild(document.createTextNode(category.name));
        input.appendChild(optn);
    });
    ctn.appendChild(label);
    ctn.appendChild(input);
    return input;
}

function fillModalAddition(ctn, nav) {
    const prevIcon = createIcon(["fa-solid", "fa-arrow-left"]);
    const txt = document.createTextNode("Ajout photo");
    const title = document.createElement("h3");
    const form = document.createElement("form");
    prevIcon.addEventListener("click", () => {
        state.modalState = "updating";
        createModal();
    });
    nav.appendChild(prevIcon);
    title.appendChild(txt);
    ctn.appendChild(title);
    const file = document.createElement("input");
    const div_file = document.createElement("div");
    file.hidden = true;
    const file_label = document.createElement("label");
    const placeholder_upload_button = document.createElement("span");
    placeholder_upload_button.appendChild(document.createTextNode("+ Ajouter photo"));
    placeholder_upload_button.classList.add("placeholder_button");
    file_label.htmlFor = "image";
    file_label.classList.add ("file_label");
    const uploadIcon = createIcon(["fa-regular", "fa-image"]);
    const limitation = document.createElement("p");
    limitation.textContent = "jpg,png:4mo max";
    file_label.appendChild(uploadIcon);
    file_label.appendChild(placeholder_upload_button);
    file_label.appendChild(limitation);
    file.id = "image";
    file.name = "image";
    file.type ="file";
    div_file.classList.add("image_file");
    div_file.appendChild(file);
    div_file.appendChild(file_label);
    form.appendChild(div_file);
    const t = createInput("title", "Titre", form);
    const l = createList("category", "Catégorie", form);
    const sub = document.createElement("input");
    sub.type = "submit"
    sub.value = "Valider"
    form.appendChild(sub);
    ctn.appendChild(form);
    form.enctype = "multipart/form-data";
    form.method = "post";
    file.addEventListener("change", (event) => {
        const files = event.target.files;
        if (files[0]) {
            const uri = URL.createObjectURL(files[0]);
            file_label.innerHTML = "";
            const img = document.createElement("img");
            img.src = uri;
            file_label.appendChild(img);
        } else {
            state.modalState = "adding";
            createModal();
        }
    });
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const fd = new FormData(form);
        const o = { 
            method: "post", 
            body: fd,
            headers: {Authorization: 'Bearer ' + localStorage.getItem("token")}
        };
        const resp = await fetch("http://localhost:5678/api/works/", o);
        console.log(resp);
        eraseModal();
        await runGallery();
    });
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
                console.log(container, fig);
                state.works = state.works.filter((work) => work.id !== id);
                container.removeChild(fig);
                grid.removeChild(div);
                
            } else {
                console.error("Something wrong");
                console.error(response);
            }
        });
    });
    const hr = document.createElement("hr");
    const buttonAdd = document.createElement("button");
    buttonAdd.appendChild(document.createTextNode("Ajouter une photo"))
    buttonAdd.classList.add("action-btn");
    buttonAdd.addEventListener("click", () => {
        state.modalState = "adding";
        createModal();

    });
    title.appendChild(txt);
    ctn.appendChild(title);
    ctn.appendChild(grid);
    ctn.appendChild(hr);
    ctn.appendChild(buttonAdd);
}
 
function fillModalContent(ctn, nav) {
    if(state.modalState == "updating") {
        fillModalEdition(ctn);
    } else if (state.modalState == "adding") {
        fillModalAddition(ctn, nav);
    }
}

function createModal() {
    const body = document.querySelector("body");
    const prevModal = document.getElementById("modal");
    if(prevModal) {
        body.removeChild(prevModal);
    }
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
    fillModalContent(ctn, nav);
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
                createModal();
            }
        });
    } else {
        console.log("arf")
    }
}


async function run() {
    await runGallery();
    runAdmin();
}

run();
