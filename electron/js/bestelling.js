apiUrl = "https://102710.stu.sd-lab.nl/rairaiken/api/"

async function getBestellingen() {
  const token = localStorage.getItem('token');
  const response = await fetch(apiUrl + 'bestelling/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    }
  });

  if (!response.ok) {
    throw new Error('Fout bij ophalen bestellingen: ' + response.statusText);
  }

  data = await response.json();
  return data;
}

async function getCurrentBestelling() {
  const bestellingen = await getBestellingen();
  const gerechtenContainer = document.getElementById('current-bestelling-gerechten');

for (const regel of bestellingen[0].Regels) {
       const cardHTML = `
             <div class="card" id="override">
                 <div class="card-body">
                     <p class="card-title">${regel.Gerecht.Naam}</p>
                     <p class="card-text">Aantal: ${regel.Aantal}</p>
                     <p class="card-text">Opmerking: ${regel.Opmerking}</p>
                     Prijs: &euro;0,00
                     <p><img class="small-image" src="../img/gerechten/${regel.Gerecht.Plaatje}" alt="${regel.Gerecht.Beschrijving}" /></p>
                </div>
            </div>
        `;
      gerechtenContainer.innerHTML += cardHTML;
    }

}

async function showBestelDatums() {
  const bestellingenContainer = document.getElementById('container');
  const bestellingen = await getBestellingen();
  const bestellingGroup = document.getElementById('bestelling-group');

  for (const bestelling of bestellingen) {
    groupTitle = bestellingGroup.innerHTML += `<option value="${bestelling.BestellingID}">Bestelling #${bestelling.BestellingID} - ${bestelling.BesteldOp}</option>`;
  }
}

async function showBestellingen() {
  const gerechtenContainer = document.getElementById('bestelling-gerechten');
  const select = document.getElementById('bestelling-group');
  gerechtenContainer.innerHTML = '';
  let selectedOption = select.selectedIndex;
  const bestellingen = await getBestellingen(); 

    for (const regel of bestellingen[selectedOption].Regels) {
       const cardHTML = `
              <div class="card" id="override">
              <div class="card-body d-flex flex-column justify-content-between">
                <span class="detail-link" style="text-decoration: none; color: inherit;">
                  <div>
                    <p class="card-title">${regel.Gerecht.Naam}</p>
                    <p class="card-text">${regel.Gerecht.Beschrijving}</p>
                    <p class="card-text">Aantal: ${regel.Aantal}</p>
                    <p class="card-text">Opmerking: ${regel.Opmerking}</p>
                    <p>Prijs: &euro;0,00</p>
                    <p><img src="../img/gerechten/${regel.Gerecht.Plaatje}" class="small-image" alt="${regel.Gerecht.Beschrijving}"></p>
                  </div>
                </span>
              </div>
            </div>
        `;
      gerechtenContainer.innerHTML += cardHTML;
    }
}

function initMap() {
  var map = L.map('map').setView([51.9274, 4.4774], 17);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var marker = L.marker([51.9274, 4.4774]).addTo(map);
marker.bindPopup("<b>Rairaken Ramen</b><br>Vanaf hier bezorgd.").openPopup();
}

showBestelDatums();
getCurrentBestelling()
initMap();
getBestellingen().then(data => console.log(data)).catch(error => console.error(error));