function focusOnElement(personId) {
    document.getElementById(personId).scrollIntoView({behavior: 'smooth', block: 'center'})
}

function highlightElement(personId) {
    document.getElementById(personId).classList.add('glow')
    setTimeout(() => {
        document.getElementById(personId).classList.remove('glow')
    }, 2000)
}

export {
    focusOnElement,
    highlightElement
}
