document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Bezig met registreren...';
    resultDiv.className = '';
    
    try {
        const response = await fetch('../signup/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            resultDiv.textContent = 'Succes! ' + JSON.stringify(result, null, 2);
            resultDiv.className = 'success';
            e.target.reset();
        } else {
            resultDiv.textContent = 'Error: ' + JSON.stringify(result, null, 2);
            resultDiv.className = 'error';
        }
    } catch (error) {
        resultDiv.textContent = 'Fetch error: ' + error.message;
        resultDiv.className = 'error';
    }
});