const response = await fetch("http://localhost:8088/corporations")
const corporations = await response.json()

export const corps = async () => {
    return corporations
}

export const Corporations = async () => {
    let corporationsHTML = `<article class="corporations"><h2>Corporations</h2>`

    const htmlStringArray = corporations.map(
        (corporation) => {
            return `<section class="corporation">
            <header class="corporation__name">
                <h1>${corporation.company}</h1>
            </header>
            <div class="corporation__info">
                <div>${corporation.address}</div>
            </div>
        </section>`
        }
    )

    corporationsHTML += htmlStringArray.join("")
    corporationsHTML += `</article>`
        
    return corporationsHTML
}