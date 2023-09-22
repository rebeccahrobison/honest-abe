export const Politicians = async () => {
    const response = await fetch("http://localhost:8088/politicians")
    const politicians = await response.json()

    const pacResponse = await fetch("http://localhost:8088/pacdonations?_expand=pac&_expand=politician")
    const pacDonations = await pacResponse.json()

    const legisResponse = await fetch("http://localhost:8088/politicianlegislations?_expand=politician&_expand=legislation")
    const politicianlegislations = await legisResponse.json()

    const corpIntResponse = await fetch("http://localhost:8088/corporateinterests?_expand=corporation&_expand=interest")
    const corporateinterests = await corpIntResponse.json()
    
    // finds all donations by pacs to a politician
    const findPacDonations = async (polId) => {
        const pacDonationsFound = pacDonations.filter((pacDonation) => polId === pacDonation.politicianId)
        return pacDonationsFound
    }
    // returns an array of a pacs name and their total donations to a politician
    const getPacDonations = (obj, pacId) => {
        let total = 0
        let pacName = ""
        for (const o of obj) {
            if(o.pacId === pacId) {
                total += parseInt(o.amount)
                pacName = o.pac.registeredName
            }
        }
        return [pacName, total]
    }
    // finds all legislation by a politician
    const findPolLegislations = async (polId) => {
        const polLegislationFound = politicianlegislations.filter(polleg => polId === polleg.politicianId)
        return polLegislationFound
    }

    // finds all corporations by interestId
    
    let politiciansHTML = `<article class="politicians"><h1>Politicians</h1>`

    for (const politician of politicians) {
        politiciansHTML += /*html*/`<section class="politician">
                <header class="politician__name">
                    <h2>${politician.name.first} ${politician.name.last}</h2>
                </header>
                <div class="politician__info">
                    <div>Age: ${politician.age}</div>
                    <div>Represents: ${politician.district}</div>
                </div>
                <div class="pac__donations">
                    <h3>PAC Donations</h3>
                    <ul>`
                
                    const foundPacDonations = await findPacDonations(politician.id)
                    if (foundPacDonations.length === 0) {
                        politiciansHTML += `<div>No found PAC donations</div>`
                    } else {
                        let totalDonationAndName = []
                        for (const pac of foundPacDonations) {
                            totalDonationAndName.push(getPacDonations(foundPacDonations, pac.pacId))
                        }

                        const setArray = new Set(totalDonationAndName.map(item => JSON.stringify(item)))
                        const removeDuplicatePacs = [...setArray].map(item => JSON.parse(item))

                        for (const pac of removeDuplicatePacs) {
                            politiciansHTML += `<li>${pac[0]} ($${pac[1]})</li>`
                        }
                        politiciansHTML += `</ul>`
                    }
                    
            politiciansHTML += `</div>`

            politiciansHTML += `<div class="politician__bills">
            <h3>Sponsored Bills</h3>`

            const foundPolLegislation = await findPolLegislations(politician.id)
            if(foundPolLegislation.length === 0) {
                politiciansHTML += `<div>No Sponsored Bills</div>`
            } else {
                console.log(foundPolLegislation)
                for (const leg of foundPolLegislation) {
                    politiciansHTML += `<div>${leg.legislation.name}</div>`
                }
            }
            

            politiciansHTML += `</div><div class="politician__influencers">
            <h3>Influencing Corporations</h3>
                <ul>`
            if (foundPolLegislation.length === 0) {
                politiciansHTML += `<div>No found influencing corporations</div>`
            } else {
                for (const p of foundPolLegislation) {
                    for (const ci of corporateinterests){
                        if (p.legislation.interestId === ci.interestId) {
                            politiciansHTML += `<li>${ci.corporation.company} has an interest in ${ci.interest.about}</li>`
                        }
                    }
                }
            }
            
            
            politiciansHTML += `</ul></div></section>`
    }

    politiciansHTML += `</article>`

    return politiciansHTML
}



    // const htmlStringArray = politicians.map(
    //     (politician) => {
    //         return /*html*/`<section class="politician">
    //         <header class="politician__name">
    //             <h1>${politician.name.first} ${politician.name.last}</h1>
    //         </header>
    //         <div class="politician__info">
    //             <div>Age: ${politician.age}</div>
    //             <div>Represents: ${politician.district}</div>
    //         </div>
    //         <div class="pac__donations">
    //             <ul>
    //     </section>`
    //     }
    // )
    // politiciansHTML += htmlStringArray.join("")