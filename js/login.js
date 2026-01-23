document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Bezig met inloggen...';
    resultDiv.className = '';

    try {
        const response = await fetch('https://102710.stu.sd-lab.nl/rairaiken/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            resultDiv.textContent = 'Succes! Ingelogd!';
            resultDiv.className = 'success';
            localStorage.setItem('token', result.token);
            e.target.reset();
            window.location.href = "index.html";
        } else {
            resultDiv.textContent = result.error;
            resultDiv.className = 'error';
        }
    } catch (error) {
        resultDiv.textContent = 'Er is een fout opgetreden: ' + error.message;
        resultDiv.className = 'error';
    }
});