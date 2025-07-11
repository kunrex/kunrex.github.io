import { loadImage } from "./projects.js";

const speed = .2;
const addAnimations = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const stateTrue = 'true'
const stateFalse = 'false'

const displayNone = 'none'
const displayBlock = 'block'

const statePaused = 'paused'
const stateRunning = 'running'

function toggleButtons(buttons, count, parent) {
    if(buttons.dataset.state === stateTrue) {
        buttons.children[0].style.display = displayBlock
        buttons.children[1].style.display = displayNone

        parent.style.animationPlayState = statePaused

        buttons.dataset.state = stateFalse
    }
    else {
        buttons.children[0].style.display = displayNone
        buttons.children[1].style.display = displayBlock

        parent.style.animationPlayState = stateRunning

        buttons.dataset.state = stateTrue
    }
}

async function initImages(local, count, parent, buttons) {
    for(let j = 0; j < 2; j++)
        for(let i = 0; i < count; i++) {
            const container = document.createElement('div')
            container.classList.add('col', i % 2 === 0 ? 'img-end' : 'img-start')

            const image = new Image();
            await loadImage(image, `${local}${(i % count) + 1}.jpeg`)

            container.appendChild(image);
            parent.appendChild(container);
        }

    buttons.children[2].style.display = displayNone

    if(!addAnimations)
    {
        const grandParent = parent.parentElement

        grandParent.textWrap = 'nowrap'
        grandParent.style.overflowX = 'scroll'

        buttons.style.display = displayNone

        return
    }

    parent.style.animation = `galleryScroll ${count / speed + Math.random() * 3}s infinite linear`

    buttons.onclick = () => {
        toggleButtons(buttons, count, parent, parent.parentElement)
    }

    buttons.dataset.state = stateTrue
    toggleButtons(buttons, count, parent, parent.parentElement)
}

export function initDrawings() {
    const count = 6;
    const local = 'assets/drawings/';

    initImages(local, count, document.getElementById('drawings-content'), document.getElementById('drawings').getElementsByClassName('icon-switch')[0]).then()
}

export function initPhotography() {
    const count = 21
    const local = 'assets/pictures/';

    initImages(local, count, document.getElementById('photography-content'), document.getElementById('photography').getElementsByClassName('icon-switch')[0]).then()
}