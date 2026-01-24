async function validateToken() {
  const token = localStorage.getItem('token');
  console.log('JWT Token:', token);
  fetch('https://102710.stu.sd-lab.nl/rairaiken/api/valideer_token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: token })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Token validation response:', data);
        if (data.valid) {
            localStorage.setItem('gegevens', JSON.stringify({id: data.user_id, naam: data.naam }));
            console.log('User gegevens stored:', localStorage.getItem('gegevens'));
            return data
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('gegevens');
        }
    })
    .catch(error => {
      console.error('Error validating token:', error);
    });
}

export { validateToken };