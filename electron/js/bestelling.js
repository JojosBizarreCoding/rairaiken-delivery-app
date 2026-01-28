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

async function showBestellingen() {
  const bestellingenContainer = document.getElementById('container');
  const bestellingen = await getBestellingen();

  for (const bestelling of bestellingen) {
    const bestellingGroup = document.createElement('div');
    bestellingGroup.classList.add('bestelling-group');
    groupTitle = document.createElement('h3');
    groupTitle.textContent = `Bestelling #${bestelling.BestellingID} - ${bestelling.BesteldOp}`;
    bestellingGroup.appendChild(groupTitle);

    for (const regel of bestelling.Regels) {
      const cardHTML = `
            <div class="card" id="override">
                <div class="card-body">
                    <h5 class="card-title">${regel.Gerecht.Naam}</h5>
                    <p class="card-text">Aantal: ${regel.Aantal}</p>
                    <p class="card-text">Opmerking: ${regel.Opmerking}</p>
                    <p class="small-image"><img src="../img/gerechten/${regel.Gerecht.Plaatje}" alt="${regel.Gerecht.Beschrijving}" /></p>
                </div>
            </div>
        `;
      bestellingGroup.innerHTML += cardHTML;
    }

    bestellingenContainer.appendChild(bestellingGroup);
  }
}

showBestellingen();
getBestellingen().then(data => console.log(data)).catch(error => console.error(error));