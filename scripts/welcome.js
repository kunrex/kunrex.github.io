const starCount = 20

export function initStars() {
    const stars = document.getElementsByClassName('stars')

    for (let i = 0; i < stars.length; i++) {
        const current = stars[i]

        let boxShadow = []
        for (let j = 0; j < starCount; j++)
            boxShadow.push(`${Math.random() * 100}vw ${Math.random() * 100}vh var(--text-color)`)

        current.style.boxShadow = `${boxShadow.join(',')}`
    }
}

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

export function initThemes() {
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

function scrollToSection(element) {
    element.scrollIntoView({
        block: "start",
        behavior: "smooth",
    })
}

function checkScrollInit(elements, indexIcons) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                for(let i = 0; i < indexIcons.length; i++)
                    if(entry.target.id === indexIcons[i].dataset.id) {
                        indexIcons[i].dataset.selected = 'true'
                        break
                    }
            }
            else {
                for(let i = 0; i < indexIcons.length; i++)
                    if(entry.target.id === indexIcons[i].dataset.id) {
                        indexIcons[i].dataset.selected = 'false'
                        break
                    }
            }
        });
    }, {
       threshold: 0.5
    });

    for(let i = 0; i < elements.length; i++)
        observer.observe(elements[i]);
}

export function initContent() {
    const indexIcons = document.getElementById('index').children;

    const elements = []
    for(let i = 0; i < indexIcons.length; i++) {
        const child = indexIcons[i]
        const element = document.getElementById(child.dataset.id)

        child.onclick = () => {
            scrollToSection(element)
        }

        elements.push(element)
    }

    checkScrollInit(elements, indexIcons)
}