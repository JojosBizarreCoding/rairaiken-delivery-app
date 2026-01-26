let refer = localStorage.getItem('ref');
if (!refer) {
    refer = 'index.html';
} else {
    try {
        const parsedRef = JSON.parse(refer);
        refer = parsedRef.page || 'index.html';
        const msg = parsedRef.msg || '';
        if (msg) {
            const msgDiv = document.getElementById('msg');
            msgDiv.textContent = msg;
            msgDiv.className = 'alert alert-info';
        }
    } catch {
        refer = 'index.html';
    }
}

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Bezig met registreren...';
    resultDiv.className = '';

    try {
        const response = await fetch('https://102710.stu.sd-lab.nl/rairaiken/api/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            resultDiv.textContent = 'Succes! Gebruiker geregistreerd!';
            resultDiv.className = 'success';
            localStorage.setItem('token', result.token);
            e.target.reset();
            window.location.href = refer;
            localStorage.removeItem('ref');
        } else {
            resultDiv.textContent = 'Error: ' + JSON.stringify(result, null, 2);
            resultDiv.className = 'error';
        }
    } catch (error) {
        resultDiv.textContent = 'Fetch error: ' + error.message;
        resultDiv.className = 'error';
    }
});