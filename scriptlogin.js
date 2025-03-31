function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};

    if (allUsers[username] && allUsers[username].password === password) {
        alert('Login successful!');
        localStorage.setItem('loggedInUser', username); 
        window.location.href = "./dashboardtrial.html"; 
    } else {
        alert('Invalid username or password. Please try again.');
    }

    return false;
}
