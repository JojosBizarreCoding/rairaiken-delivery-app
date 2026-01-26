import { addToCart } from './winkelwagen.js';

window.addToCart = addToCart;

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
            <a class="return" href="index.html">
            <button type="button" class="btn-close" aria-label="Close"></button>
            </a>
                <img src="../img/gerechten/${gerecht.Plaatje}" class="card-img-top" alt="${gerecht.Beschrijving}">
                <div class="card-body">
                    <h4 class="card-title">${gerecht.Naam}</h4>
                    <p class="card-text">${gerecht.Beschrijving}</p>
                    <p class="card-text"><h5>Ingrediënten:</h5>
                    <ul>
                        ${gerecht.Ingredienten.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                    </p>
                    <p class="card-text"><h5>Allergenen:</h5> 
                    <ul>
                        ${gerecht.Allergenen.map(allergenen => `<li>${allergenen}</li>`).join('')}
                    </ul>
                    </p>
                    <div class="d-flex align-items-center">
                        <select class="aantal" id="aantal-${gerecht.GerechtID}">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                        <button class="btn btn-primary" id="bestelButton" onclick="addToCart(${gerecht.GerechtID})">Bestel</button>
                    </div>
                    <div class="d-flex align-items-center">
                        <textarea class="form-control" id="opmerkingen" rows="3" placeholder="Opmerkingen..."></textarea>
                    </div>
                </div>
            </div>`;

        container.innerHTML = detailHTML;
    } catch (error) {
        console.error(error.message);
    }
}

getData();