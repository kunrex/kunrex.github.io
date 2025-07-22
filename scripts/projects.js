const data = await (await fetch('./assets/data.json')).json()

export function loadImage(img, src) {
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

let projectCards = []

let allTechnologies = { }
let technologyTypes = { }

let selectedTechnologies = []

const displayNone = 'none'
const displayFlex = 'flex'

const noneSelected = document.getElementById('none-selected')
const resetButton = document.getElementById('refresh-timeline')

function reloadTimeline() {
    if (resetButton.dataset.disabled === 'true')
        return

    noneSelected.style.display = 'none'

    let index = 0
    for(let i = 0; i < projectCards.length; i++) {
        const card = projectCards[i]

        card.card.style.display = displayNone
        card.card.children[0].style.animationDelay = ''
        card.card.children[0].classList.remove('project-card-animate')

        void card.card.children[0].offsetWidth;

        let disable = true
        for(let j = 0; j < selectedTechnologies.length; j++)
            if(card.stack.indexOf(selectedTechnologies[j]) >= 0) {
                disable = false
                break
            }

        if(disable)
            continue

        card.card.style.display = displayFlex
        card.card.children[0].classList.add('project-card-animate')
        card.card.children[0].style.animationDelay = `${.3 * index++}s`
    }

    if(index === 0)
        noneSelected.style.display = 'flex'

    resetButton.dataset.disabled = 'true'
}

function filter(stack) {
    const index = selectedTechnologies.indexOf(stack);
    if(index >= 0)
        selectedTechnologies.splice(index, 1)
    else
        selectedTechnologies.push(stack)

    resetButton.dataset.disabled = 'false'
}

function createCategory(title) {
    const category = document.createElement('div')
    category.classList.add('tech-category')

    const header = document.createElement('h2')
    header.innerHTML = title
    header.style.marginBottom = '1rem'

    category.appendChild(header)

    const row = document.createElement('div')
    row.classList.add('row', 'justify-evenly')
    row.style.gap = '1rem'
    row.style.flexWrap = 'wrap'

    category.appendChild(row)
    return [ category, row ]
}

function initTechTypes() {
    const types = data.types
    const techIndexElement = document.getElementById('tech-index')

    for(let i = 0; i < types.length; i++) {
        const current = types[i]

        const elements = createCategory(current.title)

        techIndexElement.appendChild(elements[0])
        technologyTypes[current.id] = {
            title: current.title,
            element: elements[1]
        }
    }
}

function createTechnologyOption(id, title) {
    const element = document.createElement('div')
    element.classList.add('tech', 'tech-choose')

    element.style.color = `var(--tech-${id}-text)`
    element.style.backgroundColor = `var(--tech-${id}-background)`

    element.innerHTML = title

    element.dataset.selected = 'false'

    element.onclick = () => {
        filter(id)
        element.dataset.selected = element.dataset.selected === 'true' ? 'false' : 'true'
    }

    return element
}

function initTechChoose() {
    const technologies = data.technologies

    for(let i = 0; i < technologies.length; i++) {
        const current = technologies[i]
        technologyTypes[current.type].element.appendChild(createTechnologyOption(current.id, current.title))

        allTechnologies[current.id] = current.title
    }
}

function initProjectTechStack(stack, stackElement)  {
    for(let i = 0; i < stack.length; i++)
    {
        const element = document.createElement('div')
        element.classList.add('tech')

        element.style.color = `var(--tech-${stack[i]}-text)`
        element.style.backgroundColor = `var(--tech-${stack[i]}-background)`

        element.innerHTML = allTechnologies[stack[i]]
        stackElement.appendChild(element)
    }
}

async function createProjectCard(projectTitle, linkUrl, linkIcon, projectContent, projectTechStack, isTop) {
    const col = document.createElement('div')
    col.classList.add('col')

    const card = document.createElement('div')
    card.classList.add('col', 'project-card')

    const title = document.createElement('div')
    title.classList.add('project-title')

    const heading = document.createElement('h3')
    heading.innerHTML = projectTitle

    const image = new Image()
    image.classList.add('project-link')

    image.onclick = () => {
        window.open(linkUrl, "_blank")
    }

    await loadImage(image, `assets/icons/${linkIcon}.png`)

    title.appendChild(heading)
    title.appendChild(image)

    const content = document.createElement('div')
    content.classList.add('project-content')

    content.innerHTML = projectContent

    const techStack = document.createElement('div')
    techStack.classList.add('row', 'tech-stack', 'overflow-x')

    initProjectTechStack(projectTechStack, techStack)

    const row = document.createElement('div')
    row.classList.add('row')

    if(isTop) {
        card.classList.add('project-top')
        row.style.paddingTop = '1rem'

        const triangle = document.createElement('div')
        triangle.classList.add('triangle-down')
        row.appendChild(triangle)

        card.appendChild(title)
        card.appendChild(content)
        card.appendChild(techStack)
        card.appendChild(row)

        col.style.justifyContent = 'start'
    }
    else {
        card.classList.add('project-bottom')
        row.style.paddingBottom = '1rem'

        const triangle = document.createElement('div')
        triangle.classList.add('triangle-up')
        row.appendChild(triangle)

        card.appendChild(row)
        card.appendChild(title)
        card.appendChild(content)
        card.appendChild(techStack)

        col.style.justifyContent = 'end'
    }

    col.appendChild(card)
    return col
}

async function initProjects() {
    const projects = data["projects"]

    const row = document.getElementById('project-timeline').children[0]

    for(let i = 0; i < projects.length; i++) {
        const current = projects[i]

        const card = await createProjectCard(current.title, current.link.url, current.link.icon, current.content, current.stack, i % 2 === 0)

        projectCards.push({
            card: card,
            stack: current.stack,
        })

        row.appendChild(card)
    }

    resetButton.onclick = () => {
        reloadTimeline()
    }

    reloadTimeline()
    resetButton.dataset.disabled = 'true'
}

export function initIndex() {
    initTechTypes()
    initTechChoose()

    initProjects().then()
}