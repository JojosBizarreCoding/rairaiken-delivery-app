import { validateToken } from "./validate_token.js";
import { addToCart, updateCartBadge } from './winkelwagen.js';

window.addToCart = addToCart;

const container = document.getElementById('cardContainer');
const images = ["ie11cats.jpg", "ie11cats2.png", "ie11joypolis.jpg", "ie11ramen.png"];
const url = 'https://102710.stu.sd-lab.nl/rairaiken/api/gerechten/';

async function getData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const gerechten = await response.json();
    console.log(gerechten);
    let counter = 0;
    let i = 0;

    for (let gerecht of gerechten) {
      const cardHTML = `
            <div class="card" id="override">
              <a href="detail.html?id=${gerecht.GerechtID}" class="detail-link" style="text-decoration: none; color: inherit;">
                <img src="../img/gerechten/${gerecht.Plaatje}" class="card-img-top" alt="${gerecht.Beschrijving}">
              </a>
              <div class="card-body d-flex flex-column justify-content-between">
                <a href="detail.html?id=${gerecht.GerechtID}" class="detail-link" style="text-decoration: none; color: inherit;">
                  <div>
                    <h5 class="card-title">${gerecht.Naam}</h5>
                    <p class="card-text">${gerecht.Beschrijving}</p>
                  </div>
                </a>
                <div>Prijs: &euro;0,00</div>
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
              </div>
            </div>`;
      const imgHTML = `<img src="../img/banners/${randomImage()}" alt="...">`;
      counter += 1;

      if (counter >= 6) {
        if (i > images.length) {
          i = 0;
          container.innerHTML += `${cardHTML}${imgHTML}`;
        } else {
          counter = 0;
          i += 1;
          container.innerHTML += `${cardHTML}${imgHTML}`;
        }

      } else {
        container.innerHTML += cardHTML;
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

function randomImage() {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

getData(url);
validateToken();
updateCartBadge();