const url = 'https://102710.stu.sd-lab.nl/rairaiken/api/';


async function validateToken() {
  try {

    const bestelling = localStorage.getItem("bestelling");
            const response = await fetch(url + "bestelling/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ regels: JSON.parse(bestelling) })
            });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    } catch (error) {
    console.error("Error fetching data:", error);
  } 
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
        let container = document.getElementById('container');
        const response = await fetch(url + 'gerecht/?id=' + gerechtID);
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
              </div>
            </div>`;

        container.innerHTML += cardHTML;

    }
}

validateToken();
getGerechten();
