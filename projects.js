const data = await (await fetch('assets/data.json')).json()

export function loadImage(img, src) {
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

let cards = []
let stacks = []

function reset(timeline) {
    timeline.style.width = 0;

    for(let i = 0; i < cards.length; i++) {
        const card = cards[i]

        let disable = true
        for(let j = 0; j < stacks.length; j++)
            if(card.stack.indexOf(stacks[j]) >= 0) {
                disable = false
                break
            }

        card.card.style.display = disable ? 'none' : 'flex'
    }

    timeline.style.width = `${timeline.parentElement.scrollWidth}px`
}

function filter(stack, timeline) {
    const index = stacks.indexOf(stack);
    if(index >= 0)
        stacks.splice(index, 1)
    else
        stacks.push(stack)

    reset(timeline)
}

export function initIndex() {
    const technologies = data["technologies"]
    const techIndex = document.getElementById('tech-index')

    const timeline = document.getElementById('project-timeline').children[1]

    for(let i = 0; i < technologies.length; i++) {
        const current = technologies[i]

        const element = document.createElement('div')
        element.classList.add('tech')

        element.style.color = `var(--tech-${current}-text)`
        element.style.backgroundColor = `var(--tech-${current}-background)`

        element.innerHTML = current

        element.dataset.selected = 'true'

        element.onclick = () => {
            filter(current, timeline)
            element.dataset.selected = element.dataset.selected === 'true' ? 'false' : 'true'
        }

        techIndex.appendChild(element)

        stacks.push(current)
    }
}

export async function initProjects() {
    const parent = document.getElementById('project-timeline')
    const row1 = parent.children[0]
    const row2 = parent.children[2]
    const timeline = parent.children[1]

    const projects = data["projects"]

    const filler = document.createElement('div')
    filler.classList.add('filler-card')

    row2.appendChild(filler)

    for(let i = 0; i < projects.length; i++) {
        const current = projects[i]

        const card = document.createElement('div')
        card.classList.add('col', 'project-card')

        const title = document.createElement('div')
        title.classList.add('project-title')

        const heading = document.createElement('h3')
        heading.innerHTML = current.title

        const image = new Image()
        image.classList.add('project-link')

        await loadImage(image, `assets/icons/${current["link"]["icon"]}.png`)

        image.onclick = () => {
            window.open(current["link"]['url'], "_blank")
        }

        title.appendChild(heading)
        title.appendChild(image)

        const content = document.createElement('div')
        content.classList.add('project-content')

        content.innerHTML = current.content

        const techStack = document.createElement('div')
        techStack.classList.add('row', 'tech-stack', 'overflow-x')

        const stack = current["stack"]
        for(let i = 0; i < stack.length; i++)
        {
            const element = document.createElement('div')
            element.classList.add('tech')

            element.style.color = `var(--tech-${stack[i]}-text)`
            element.style.backgroundColor = `var(--tech-${stack[i]}-background)`

            element.innerHTML = stack[i]
            techStack.appendChild(element)
        }

        const row = document.createElement('div')
        row.classList.add('row')

        if(i % 2 === 0) {
            card.classList.add('project-top')
            row.style.paddingTop = '1rem'

            const triangle = document.createElement('div')
            triangle.classList.add('triangle-down')
            row.appendChild(triangle)

            card.appendChild(title)
            card.appendChild(content)
            card.appendChild(techStack)
            card.appendChild(row)

            row1.appendChild(card)
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

            row2.appendChild(card)
        }

        cards.push({
            card: card,
            stack: stack,
        })
    }

    timeline.style.width = `${parent.scrollWidth}px`
}