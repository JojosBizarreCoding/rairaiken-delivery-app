const apiUrl = "https://102710.stu.sd-lab.nl/rairaiken/api/" 

window.removeFromCart = removeFromCart;
window.plaatsBestelling = plaatsBestelling;

function addToCart(gerechtID) {
    let aantal = document.getElementById(`aantal-${gerechtID}`).value;
    let opmerkingen;
    try {
        opmerkingen = document.getElementById('opmerkingen').value;
    } catch (e) {
        opmerkingen = '';
    }
    let bestelling = [];
    try {
        const parsed = JSON.parse(localStorage.getItem("bestelling"));
        if (Array.isArray(parsed)) bestelling = parsed;
    } catch (e) { }

    bestelling.push({
        gerechtId: gerechtID,
        aantal: parseInt(aantal),
        opmerking: opmerkingen
    });
    localStorage.setItem("bestelling", JSON.stringify(bestelling));
}

async function getGerechten() {
    let bestelling = [];
    try {
        const parsed = JSON.parse(localStorage.getItem("bestelling"));
        if (Array.isArray(parsed)) bestelling = parsed;
    } catch (e) { }
    
    console.log(bestelling);

    for (let item of bestelling) {
        let gerechtID = item.gerechtId;
        let container = document.getElementById('cardContainer');
        const response = await fetch(apiUrl + 'gerecht/?id=' + gerechtID);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const gerecht = await response.json();
        const cardHTML = `
            <div class="card mb-3" id="override">
              <div class="row g-0">
                <div class="col-md-4">
                  <img src="../img/gerechten/${gerecht.Plaatje}" class="img-fluid rounded-start" alt="${gerecht.Beschrijving}">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${gerecht.Naam}</h5>
                    <p class="card-text">${gerecht.Beschrijving}</p>
                    <p class="card-text">Aantal: ${item.aantal}</p>
                    <p class="card-text">Opmerkingen: ${item.opmerking}</p>
                    <div class="d-flex align-items-center">
                      <button class="btn btn-danger" onclick="removeFromCart(${gerechtID}, ${item.aantal}, '${item.opmerking}')">Verwijder</button>
                  </div>
                </div>
              </div>
            </div>`;
        container.innerHTML += cardHTML;

    }
}

function removeFromCart(gerechtID, aantal, opmerking) {
    let bestelling = [];
    try {
        const parsed = JSON.parse(localStorage.getItem("bestelling"));
        if (Array.isArray(parsed)) bestelling = parsed;
    } catch (e) {
        console.error(e);
    }

    const gerechtTeVerwijderen = bestelling.findIndex(item => 
        item.gerechtId == gerechtID && 
        item.aantal == aantal && 
        item.opmerking == opmerking
    );

    if (gerechtTeVerwijderen !== -1) {
        bestelling.splice(gerechtTeVerwijderen, 1);
    }

    localStorage.setItem("bestelling", JSON.stringify(bestelling));
    location.reload();
}

async function plaatsBestelling() {
    let error;
    const errorMessageDiv = document.getElementById('errorMessage');
    
    if (localStorage.getItem("bestelling") && localStorage.getItem("bestelling") !== '[]') {
        try {
            const bestelling = localStorage.getItem("bestelling");
            const response = await fetch(apiUrl + 'bestelling/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ regels: JSON.parse(bestelling) })
            });
            if (!response.ok) {
                error = `Fout bij plaatsen bestelling: ${JSON.stringify(response.error)}`;
            }
        } catch (err) {
            error = 'Fout bij plaatsen bestelling: ' + err.message;
        }
    } else {
        error = "Winkelwagen is leeg!";
    }
    if (error) {
        errorMessageDiv.style.display = 'block';
        errorMessageDiv.textContent = error;
    } else {
        // localStorage.removeItem("bestelling");
        // window.location.href = 'bestelling-bevestiging.html';
    }
}

if (window.location.pathname.endsWith('winkelwagen.html')) {
    getGerechten();
}

export { addToCart };