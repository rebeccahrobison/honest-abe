export const CorpDonations = async () => {
    const response = await fetch("http://localhost:8088/corporatedonations?_expand=corporation&_expand=pac")
    const corpDonations = await response.json()

    const pacResponse = await fetch("http://localhost:8088/pacs")
    const pacs = await pacResponse.json()

    
    // returns list of corporations that donated to a pac
    const findCorporationDonations = async (pacId) => {
        const corpDonationsFound = corpDonations.filter((corpDonation) => pacId === corpDonation.pacId)
        return corpDonationsFound
    }

    // for a corporation, returns total amount donated to pac
    const getTotalCorpDonation = (obj, corpId) => {
        let total = 0
        let companyName = ""
        for (const o of obj) {
            if (o.corporationId === corpId) {
                total += parseInt(o.amount)
                companyName = o.corporation.company
            }
        }
        return [companyName, total]
    }

    let pacsHTML = `<article class="pacs"><h2>PACs</h2>`

    for (const pac of pacs) {
        pacsHTML += `<section class="pac">
        <header class="pac__name">
            <h3>${pac.registeredName}</h3>
        </header>
        <div class="pac__info">
            <div>${pac.address}</div>
        </div>
        <div class="pac__donors">
            <h3>Donors</h3>
            <ul>`

            const foundCorpDonations = await findCorporationDonations(pac.id)
            
            let totalDonationAndName = []
            for (const corp of foundCorpDonations) {
                totalDonationAndName.push(getTotalCorpDonation(foundCorpDonations, corp.corporationId))
            }

            const setArray = new Set(totalDonationAndName.map(item => JSON.stringify(item)))
            const removeDuplicateCorps = [...setArray].map(item => JSON.parse(item))

            
            for (const corp of removeDuplicateCorps) {
                pacsHTML += `<li>${corp[0]} ($${corp[1]})</li>`
            }
            
        pacsHTML += `</ul></div></section>`
}

    pacsHTML += `</article>`

    return pacsHTML
}   

