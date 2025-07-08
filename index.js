import { initIndex, initProjects, loadImage } from "./projects.js";

let theme
function initDarkTheme(buttonParent) {
    const globalStyle = document.documentElement.style

    globalStyle.setProperty('--text-color', 'var(--dark-mode-text)')
    globalStyle.setProperty('--background-color', 'var(--dark-mode-background)')

    globalStyle.setProperty('--secondary-color', 'var(--dark-mode-secondary)')

    buttonParent.children[0].style.display = 'none'
    buttonParent.children[1].style.display = 'block'

    theme = 'dark'
}

function initLightTheme(buttonParent) {
    const globalStyle = document.documentElement.style

    globalStyle.setProperty('--text-color', 'var(--light-mode-text)')
    globalStyle.setProperty('--background-color', 'var(--light-mode-background)')

    globalStyle.setProperty('--secondary-color', 'var(--light-mode-secondary)')

    buttonParent.children[0].style.display = 'block'
    buttonParent.children[1].style.display = 'none'

    theme = 'light'
}

function initThemes() {
    const themeButton = document.getElementById('theme')

    if(window.matchMedia('(prefers-color-scheme: dark)').matches)
        initDarkTheme(themeButton)
    else
        initLightTheme(themeButton)

    themeButton.onclick = () => {
        if(theme === 'light')
            initDarkTheme(themeButton)
        else
            initLightTheme(themeButton)
    }
}

initThemes()

function initTabs() {
    const contentIndex = document.querySelector('.index').children;

    const elements = []
    for(let i = 0; i < contentIndex.length; i++) {
        const child = contentIndex[i]

        const element = document.getElementById(child.dataset.id)

        elements.push(element)
        const original = element.style.display

        if(i > 0)
            element.style.display = 'none'

        child.onclick = () => {
            for(let i = 0; i < elements.length; i++)
                elements[i].style.display = 'none'

            element.style.display = original
        }
    }
}

initTabs()

const speed = 6 / 30;
const addAnimations = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

function toggleButtons(button, count, parent) {
    if(button.dataset.state === 'true') {
        button.children[0].style.display = 'block'
        button.children[1].style.display = 'none'

        parent.style.animationPlayState = 'paused'

        button.dataset.state = 'false'
    }
    else {
        button.children[0].style.display = 'none'
        button.children[1].style.display = 'block'

        parent.style.animationPlayState = 'running'

        button.dataset.state = 'true'
    }
}

async function initImages(local, count, parent, button) {
    for(let j = 0; j < 2; j++)
        for(let i = 0; i < count; i++) {
            const container = document.createElement('div')
            container.classList.add('col')
            container.classList.add(i % 2 === 0 ? 'img-end' : 'img-start')

            const image = new Image();

            await loadImage(image, `${local}${(i % count) + 1}.jpeg`)

            container.appendChild(image);
            parent.appendChild(container);
        }

    if(!addAnimations)
    {
        const grandParent = parent.parentElement

        grandParent.textWrap = 'nowrap'
        grandParent.style.overflowX = 'scroll'

        button.style.display = 'none'

        return
    }

    parent.style.animation = `galleryScroll ${count / speed + Math.random() * 3}s infinite linear`

    button.onclick = () => {
        toggleButtons(button, count, parent, parent.parentElement)
    }

    button.dataset.state = (!addAnimations).toString()
    toggleButtons(button, count, parent, parent.parentElement)
}

function initDrawings() {
    const count = 6;
    const local = 'assets/drawings/';

    const parent = document.getElementById('drawings-content')

    initImages(local, count, parent, document.getElementById('drawings').getElementsByClassName('icon-switch')[0]).then()
}

function initPhotos() {
    const count = 21
    const local = 'assets/pictures/';

    const parent = document.getElementById('photography-content')

    initImages(local, count, parent, document.getElementById('photography').getElementsByClassName('icon-switch')[0]).then()
}

initPhotos()
initDrawings()

function initAboutMeScroll() {
    const theresMore = document.getElementById('theres-more')
    const aboutMeContent = document.getElementById('about-me-scroll').children[0].children

    const last = aboutMeContent[aboutMeContent.length - 1]

    let show = true
    let deAnimate = false
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if(e.isIntersecting) {
                show = false
                if(deAnimate)
                    theresMore.dataset.animate = 'false'
            }
        })
    }, {
        threshold: .8,
    })

    observer.observe(last)

    setTimeout(() => {
        if(show)
        {
            deAnimate = true
            theresMore.dataset.animate = 'true'
        }
    }, 15000)
}

initAboutMeScroll()

initIndex()
initProjects().then()