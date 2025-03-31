function createUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

   
    const usernameRegex = /^[A-Za-z0-9]{4,}$/;
    if (!usernameRegex.test(username)) {
        alert('Username must contain only alphabets and numbers, and be at least 4 characters long.');
        return false;
    }

   
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert('Password must be at least 8 characters long and include at least one letter, one number, and one special character.');
        return false;
    }

    
    
    let allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};

   
    if (allUsers[username]) {
        alert("Username already exists! Please choose another.");
        return false;
    }

    
    allUsers[username] = { password: password };

    
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    alert("Your account has been created , Now try to login");
    window.location.href = "./index.html"; 
    return false;
}