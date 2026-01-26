function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('gegevens');
    location.reload();
}
