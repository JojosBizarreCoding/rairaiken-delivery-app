const container = document.getElementById('cardContainer');
const images = ["8isk6jv0qy4g1.png", "481708804_18045846239356062_5904598843501618291_n.jpg", "inazuma-eleven-ina11.png", "nwr83lyuqtje1.jpeg"];
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
      const cardHTML = `<div class="card" id="override">
            <img src="../${gerecht.Plaatje}" class="card-img-top" alt="${gerecht.Beschrijving}">
            <div class="card-body d-flex flex-column justify-content-between">
            <div>
                <h5 class="card-title">${gerecht.Naam}</h5>
                <p class="card-text">${gerecht.Beschrijving}</p>
            </div>
                <a href="#" class="btn btn-primary">Bestel</a>
            </div>
        </div>`;
      const imgHTML = `<img src="../img/${images[0+i]}" alt="...">`;
      counter += 1;
        console.log(counter);

        if (counter >= 6){
          if (i > images.length){
            i = 0;
            container.innerHTML += `${cardHTML}${imgHTML}`
          } else {
            counter = 0;
            i += 1;
            container.innerHTML += `${cardHTML}${imgHTML}`
          }

        } else {
    container.innerHTML += cardHTML; }
        }
  } catch (error) {
    console.error(error.message);
  }
}

getData(url);
