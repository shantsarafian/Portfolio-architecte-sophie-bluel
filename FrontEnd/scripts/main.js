function makeState(categories, works) {
    return {
        activeCategory: 0,
        categories,
        works
    };
};

function renderWorks(state) {
    const container = document.querySelector("#portfolio > .gallery");
    container.innerHTML = "";
    const filteredWorks = state.works.filter(work =>
        state.activeCategory == 0 || work.category.id == state.activeCategory
    );
    filteredWorks.forEach(element => {
        const figure = document.createElement("figure");
        const caption = document.createElement("figcaption");
        const title = document.createTextNode(element.title);
        const image = document.createElement("img");
        image.alt = element.title;
        image.src = element.imageUrl;
        container.appendChild(figure);
        figure.appendChild(image);
        figure.appendChild(caption);
        caption.appendChild(title);
    });
    return state;
}

function renderButton(state, id, name, container) {
    const text = document.createTextNode(name);
    const button = document.createElement("button");
    if (id == state.activeCategory) {
        button.classList.add("active");
    }
    button.addEventListener("click", () => {
        state.activeCategory = id;
        renderApplication(state);
    });
    button.appendChild(text);
    container.appendChild(button);
}

function renderCategories(state) {
    const container = document.querySelector("#portfolio > nav");
    container.innerHTML = "";
    renderButton(state, 0, "Tous", container);
    state.categories.forEach(category => {
        renderButton(state, category.id, category.name, container);
    });
    return state;
}

function renderApplication(state) {
    renderCategories(state);
    renderWorks(state);
    return state;
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
    const categories = await getCategories();
    const works = await getWorks();
    return makeState(categories, works);
}

async function run() {
    const state = await getData();
    renderApplication(state);
}

run();