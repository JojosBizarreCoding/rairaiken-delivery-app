import { validateToken } from './validate_token.js';

async function laatNaamZien() {
    try {
        // Log to console to ensure script is running
        console.log("Checking login status...");
        
        const validationData = await validateToken();
        console.log("Validation result:", validationData);

        const naamElement = document.getElementById('naam');
        const loginElement = document.getElementById('login');
        const signupElement = document.getElementById('signup');

        if (validationData && validationData.valid) {
            const naam = validationData.naam;
            
            if (naamElement) {
                if (loginElement) loginElement.style.display = 'none';
                if (signupElement) signupElement.style.display = 'none';
                naamElement.textContent = `Welkom, ${naam}`;
            } else {
                console.warn("Element with id 'naam' not found");
            }
        }
    } catch (error) {
        console.error("Error in laatNaamZien:", error);
    }
}
laatNaamZien();