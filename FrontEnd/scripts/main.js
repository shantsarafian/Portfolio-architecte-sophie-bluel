const defaultCategory = "Tous";

function makeState(works) {
    const categories = works.map(work => work.category.name);
    return {
        activeCategory: defaultCategory,
        categories: new Set(categories),
        works
    };
};

function renderWorks(state) {
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
        image.alt = element.title;
        image.src = element.imageUrl;
        container.appendChild(figure);
        figure.appendChild(image);
        figure.appendChild(caption);
        caption.appendChild(title);
    });
    return state;
}

function renderButton(state, name, container) {
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

function renderCategories(state) {
    const container = document.querySelector("#portfolio > nav");
    container.innerHTML = "";
    renderButton(state, defaultCategory, container);
    state.categories.forEach(category => {
        renderButton(state, category, container);
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


async function getData() {
    const works = await getWorks();
    return makeState(works);
}

async function run() {
    const state = await getData();
    console.log(state);
    renderApplication(state);
}

run();