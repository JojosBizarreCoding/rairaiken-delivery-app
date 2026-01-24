async function validateToken() {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('https://102710.stu.sd-lab.nl/rairaiken/api/valideer_token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: token })
    });

    const data = await response.json();
    console.log('Token validation response:', data);

    if (data.valid) {
      localStorage.setItem('gegevens', JSON.stringify({ id: data.user_id, naam: data.naam }));
      console.log('User gegevens stored:', localStorage.getItem('gegevens'));
      return data;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('gegevens');
      return null;
    }
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}

export { validateToken };