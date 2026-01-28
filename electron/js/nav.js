import { validateToken } from './validate_token.js';


async function laatNaamZien() {
    try {
        // Log to console to ensure script is running
        console.log("Checking login status...");
        
        const validationData = await validateToken();
        console.log("Validation result:", validationData);

        const naamElement = document.getElementById('naam');
        const signupElement = document.getElementById('signup');

        
        if (validationData && validationData.valid) {
            const naam = validationData.naam;
            const naamHTML = `
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${naam}
          </a>
          <ul class="dropdown-menu">
            <!-- <li><a class="dropdown-item" href="#">Profiel</a></li> -->
            <li><a class="dropdown-item" href="bestelling.html">Zie bestelgeschiedenis</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" onclick="logout()">Log uit</button></li>
          </ul>`

            
            if (naamElement) {
                if (signupElement) signupElement.style.display = 'none';
                naamElement.innerHTML = naamHTML;
            } else {
                console.warn("Element with id 'naam' not found");
            }
        } else {
            naamElement.style.display = 'none'; 
        }
    } catch (error) {
        console.error("Error in laatNaamZien:", error);
    }
}
laatNaamZien();