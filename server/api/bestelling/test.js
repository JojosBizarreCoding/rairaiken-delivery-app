// Extreem janky test code.
// Als je de frontend maakt kun je het hier op baseren, maar daar moet de code beter zijn.
// Dit is puur om de API te testen.
async function displayGerechten() {
    const container = document.createElement('div');
    container.id = 'gerechtenLijst';
    document.body.appendChild(container);

    try {
        const response = await fetch('../gerechten/index.php');
        if (!response.ok) throw new Error('Fout bij ophalen gerechten');
        const gerechten = await response.json();

        if (!Array.isArray(gerechten) || gerechten.length === 0) {
            container.textContent = 'Geen gerechten gevonden.';
            return;
        }

        const ul = document.createElement('ul');
        gerechten.forEach(gerecht => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${gerecht.Naam}</strong> (ID: ${gerecht.GerechtID})<br>
                ${gerecht.Beschrijving || ''}<br>
                <em>Ingredienten:</em> ${Array.isArray(gerecht.Ingredienten) ? gerecht.Ingredienten.join(', ') : gerecht.Ingredienten}<br>
                <em>Allergenen:</em> ${Array.isArray(gerecht.Allergenen) ? gerecht.Allergenen.join(', ') : gerecht.Allergenen}
                <img src="../../${gerecht.Plaatje}" alt="${gerecht.Naam}" style="max-width:200px; display:block; margin-top:10px;">
                <button type="button">Toevoegen aan winkelwagen</button>
                <input type="number" value="1" min="1" style="width:50px; margin-left:10px;">
                <input type="text" placeholder="Opmerkingen" style="margin-left:10px;">`;
            const button = li.querySelector('button');
            button.addEventListener('click', function(event) {
                winkelwagenToevoegen(gerecht.GerechtID, event);
            });
            ul.appendChild(li);
        });
        container.appendChild(ul);
    } catch (err) {
        container.textContent = 'Fout: ' + err.message;
    }
}
displayGerechten();

function winkelwagenToevoegen(gerechtID, event) {
    const li = event.target.closest('li');
    const aantalInput = li.querySelector('input[type="number"]');
    const opmerkingenInput = li.querySelector('input[type="text"]');
    const aantal = aantalInput ? parseInt(aantalInput.value) : 1;
    const opmerkingen = opmerkingenInput ? opmerkingenInput.value : '';

    let bestelling = [];
    try {
        const parsed = JSON.parse(localStorage.getItem("bestelling"));
        if (Array.isArray(parsed)) bestelling = parsed;
    } catch (e) {}

    bestelling.push({
        gerechtId: gerechtID,
        aantal: aantal,
        opmerking: opmerkingen
    });

    localStorage.setItem("bestelling", JSON.stringify(bestelling));
    alert('Gerecht toegevoegd aan winkelwagen!');
}

async function verstuurBestelling() {
    let bestelling = [];
    try {
        const parsed = JSON.parse(localStorage.getItem("bestelling"));
        if (Array.isArray(parsed)) bestelling = parsed;
    } catch (e) {}

    if (bestelling.length === 0) {
        alert('Winkelwagen is leeg!');
        return;
    }

    try {
        const response = await fetch('index.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ regels: bestelling }) // <-- hier!
        });
        if (!response.ok) throw new Error('Fout bij versturen bestelling');
        const result = await response.json();
        alert('Bestelling succesvol verstuurd');
        localStorage.removeItem("bestelling");
    } catch (err) {
        alert('Fout: ' + err.message);
    }
}