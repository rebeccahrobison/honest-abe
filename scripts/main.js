import { CorpDonations } from "./CorpDonations.js"
import { Corporations } from "./Corporations.js"
import { Politicians } from "./Politicians.js"

const container = document.querySelector("#container")

const render = async () => {
    const politiciansHTML = await Politicians()
    const corporationsHTML = await Corporations()
    const pacHTML = await CorpDonations()

    const html =`
    <h1>Honest Abe</h1>
    ${politiciansHTML}
    ${corporationsHTML}
    ${pacHTML}`

    container.innerHTML = html
}

render()
