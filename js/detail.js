const container = document.getElementById('cardContainer');
const url = 'https://102710.stu.sd-lab.nl/rairaiken/api/gerecht/';
const idParam = new URLSearchParams(window.location.search).get('id');

async function getData() {
    try {
        const response = await fetch(`${url}?id=${idParam}`);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
        const gerecht = await response.json();
        console.log(gerecht);
        document.getElementById('gerechtTitel').innerText = gerecht.Naam;
        const detailHTML = `
            <div class="card mb-3" id="override" style="max-width: 540px;">
                <img src="../img/gerechten/${gerecht.Plaatje}" class="card-img-top" alt="${gerecht.Beschrijving}">
                <div class="card-body">
                    <h5 class="card-title">${gerecht.Naam}</h5>
                    <p class="card-text">${gerecht.Beschrijving}</p>
                    <p class="card-text">Ingrediënten:
                    <ul>
                        ${gerecht.Ingredienten.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                    </p>
                    <p class="card-text">Alleergenen: 
                    <ul>
                        ${gerecht.Allergenen.map(allergenen => `<li>${allergenen}</li>`).join('')}
                    </ul>
                    </p>
                    <div class="d-flex align-items-center">
                        <input type="number" id="aantal" name="aantal" min="1" value="1" class="form-control me-2" />
                        <button class="btn btn-primary" id="bestelButton">Bestel</button>
                    </div>
                </div>
            </div>`;

        container.innerHTML = detailHTML;
    } catch (error) {
        console.error(error.message);
    }
}

getData();