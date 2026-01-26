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
    updateCartBadge()
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
            <div class="card" id="override">
              <span class="detail-link" style="text-decoration: none; color: inherit;">
                <img src="../img/gerechten/${gerecht.Plaatje}" class="card-img-top" alt="${gerecht.Beschrijving}">
              </span>
              <div class="card-body d-flex flex-column justify-content-between">
                <span class="detail-link" style="text-decoration: none; color: inherit;">
                  <div>
                    <h5 class="card-title">${gerecht.Naam}</h5>
                    <p class="card-text">${gerecht.Beschrijving}</p>
                    <p class="card-text">Aantal: ${item.aantal}</p>
                    <p class="card-text">Opmerking: ${item.opmerking}</p>
                  </div>
                </span>
                  <button class="btn btn-danger" onclick="removeFromCart(${gerechtID}, ${item.aantal}, '${item.opmerking}')">Verwijder</button>
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
                const errorData = await response.json();
                console.error(`Response status: ${response.status}`, errorData);
                if (errorData.error === 'Ongeldig token') {
                    localStorage.removeItem('token');
                    localStorage.setItem('ref', `{"page": "winkelwagen.html", "msg": "Login of maak een account aan om je bestelling te plaatsen."}`);
                    window.location.href = 'login.html';
                    return;
                }
                error = `Fout bij plaatsen bestelling: ${errorData.error}`;
            } else {
                // localStorage.removeItem("bestelling");
                // window.location.href = 'bestelling-bevestiging.html';
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

function updateCartBadge() {
    const badge = document.getElementById(`cartBadge`);
    let bestelling = [];
    try {
        const parsed = JSON.parse(localStorage.getItem("bestelling"));
        if (Array.isArray(parsed)) bestelling = parsed;
    } catch (e) { 
        console.error(e);
    }
    let aantalItems = 0;
    for (let i = 0; i < bestelling.length; i++) {
        aantalItems += bestelling[i].aantal;
    }
    badge.innerText = aantalItems;
}

if (window.location.pathname.endsWith('winkelwagen.html')) {
    getGerechten();
}

export { addToCart, updateCartBadge};