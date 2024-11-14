// List of valid accounts with usernames and passwords
const validAccounts = [
    { username: 'Dmitry Fladiro', password: 'toxic135', role: 'admin' },
    { username: 'Thorne Manfaloty', password: 'chiefthorne', role: 'admin' },
    { username: 'Adam', password: 'secure456', role: 'admin' },
    { username: 'Ezekiel Robert', password: 'Ezekiel67990832123', role: 'admin' },
    { username: 'Vincent OConner', password: 'Vincent67990832123', role: 'detective' },
    { username: 'Arthur', password: 'secure456', role: 'detective' },
    { username: 'Charles', password: 'secure456', role: 'detective' }
    // { username: 'Adam', password: 'investigate789', role: 'admin' }
];


// Check if user is already logged in
if (localStorage.getItem('loggedIn') === 'true') {
    showDatabase();
}

// Handle Login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const account = validAccounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userRole', account.role);
        localStorage.setItem('loggedInUser', account.username); // Store the username
        showDatabase();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});




// Function to show database and hide login page
function showDatabase() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('database-page').style.display = 'block';
    loadSuspects();

    const userRole = localStorage.getItem('userRole');
    const clearSuspectBtn = document.getElementById('clear-suspect-btn');

    // Ensure role retrieval is working correctly
    console.log('Current user role:', userRole);

    if (userRole !== 'admin') {
        clearSuspectBtn.style.display = 'none'; // Hide button for non-admin users
    } else {
        clearSuspectBtn.style.display = 'block'; // Ensure the button is displayed for admins
    }
}



// Handle Logout
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('loggedIn'); // Clear login state
    document.getElementById('database-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
});

// Show Add Suspect Modal
const addSuspectBtn = document.getElementById('add-suspect-btn');
const modal = document.getElementById('add-suspect-modal');
const closeModal = document.querySelector('.close');

addSuspectBtn.onclick = function() {
    modal.style.display = 'block';
}

closeModal.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Load suspects from local storage
function loadSuspects() {
    const suspects = JSON.parse(localStorage.getItem('suspects')) || [];
    displaySuspects(suspects);
}

// Display suspects
function displaySuspects(suspects) {
    const resultsDiv = document.getElementById('suspect-results');
    resultsDiv.innerHTML = '';
    const userRole = localStorage.getItem('userRole'); // Get the logged-in user's role

    suspects.forEach((suspect, index) => {
        const card = document.createElement('div');
        card.classList.add('suspect-card');
        
        card.innerHTML = `
            <img src="${suspect.photo}" alt="Suspect Photo">
            <h3>${suspect.name}</h3>
            <p><strong>DOB:</strong> ${suspect.dob}</p>
            <p><strong>CIV ID:</strong> ${suspect.civId}</p>
            <p><strong>Known Convictions:</strong> ${suspect.convictions}</p>
            <p><strong>Tags:</strong> ${suspect.tags}</p>
            <p><strong>Summary:</strong> ${suspect.summary}</p>
            <p><strong>Added By:</strong> ${suspect.addedBy}</p>
        `;
        
        // Only show the delete button if the user is an admin
        if (userRole === 'admin') {
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'Delete Suspect';
            deleteButton.onclick = function() {
                deleteSuspect(index);
            };
            card.appendChild(deleteButton);
        }

        resultsDiv.appendChild(card);
    });
}



// Add Suspect
document.getElementById('suspect-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const photo = document.getElementById('photo').value || 'https://via.placeholder.com/150';
    const dob = document.getElementById('dob').value;
    const civId = document.getElementById('civ-id').value;
    const convictions = document.getElementById('convictions').value;
    const tags = Array.from(document.getElementById("tags").selectedOptions).map(option => option.value);
    const summary = document.getElementById('summary').value;
    const addedBy = localStorage.getItem('loggedInUser'); // Get the logged-in user

    const suspect = { name, photo, dob, civId, convictions, tags, summary, addedBy };

    let suspects = JSON.parse(localStorage.getItem('suspects')) || [];
    suspects.push(suspect);
    localStorage.setItem('suspects', JSON.stringify(suspects));
    
    displaySuspects(suspects);
    document.getElementById('suspect-form').reset();
    modal.style.display = 'none';
});


// Clear All Suspects
document.getElementById('clear-suspect-btn').addEventListener('click', function() {
    const userRole = localStorage.getItem('userRole');

    if (userRole === 'admin') {
        localStorage.removeItem('suspects');
        displaySuspects([]);
        alert('All suspects have been cleared.');
    } else {
        alert('You do not have permission to clear suspects.');
    }
});



// Delete Specific Suspect
function deleteSuspect(index) {
    let suspects = JSON.parse(localStorage.getItem('suspects')) || [];
    suspects.splice(index, 1);
    localStorage.setItem('suspects', JSON.stringify(suspects));
    displaySuspects(suspects);
}

// Search Suspect
document.getElementById('search').addEventListener('input', function() {
    const query = document.getElementById('search').value.toLowerCase();
    const suspects = JSON.parse(localStorage.getItem('suspects')) || [];
    
    const filteredSuspects = suspects.filter(suspect =>
        suspect.name.toLowerCase().includes(query) ||
        suspect.civId.toLowerCase().includes(query)
                                             
    );
    
    displaySuspects(filteredSuspects);
});


document.addEventListener("contextmenu", function(e) {
    e.preventDefault(); // Disable right-click
});

document.onkeydown = function(e) {
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        return false;
    }
};

