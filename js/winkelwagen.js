function addToCart(gerechtID) {
    let aantal = document.getElementById('aantal').value;
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