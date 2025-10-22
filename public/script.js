// This function will be called when the user clicks "Search Available Cottages"
function searchCottages() {
    // Get all input values from the form
    const bookerName = document.getElementById('bookerName').value;
    const numPeople = document.getElementById('numPeople').value;
    const numBedrooms = document.getElementById('numBedrooms').value;
    const maxDistLake = document.getElementById('maxDistLake').value;
    const city = document.getElementById('city').value;
    const maxDistCity = document.getElementById('maxDistCity').value;
    const numDays = document.getElementById('numDays').value;
    const startDate = document.getElementById('startDate').value;
    const dateShift = document.getElementById('dateShift').value;

    // Validate that all fields are filled
    if (!bookerName || !numPeople || !numBedrooms || !maxDistLake || 
        !city || !maxDistCity || !numDays || !startDate || !dateShift) {
        alert('Please fill in all fields before searching!');
        return;
    }

    // Show loading message
    document.getElementById('results').style.display = 'block';
    document.getElementById('cottageList').innerHTML = '<p>Searching for available cottages...</p>';

    // Create the request data object
    const requestData = {
        bookerName: bookerName,
        numPeople: parseInt(numPeople),
        numBedrooms: parseInt(numBedrooms),
        maxDistLake: parseInt(maxDistLake),
        city: city,
        maxDistCity: parseInt(maxDistCity),
        numDays: parseInt(numDays),
        startDate: startDate,
        dateShift: parseInt(dateShift)
    };

    // THIS IS WHERE YOUR BACKEND TEAM WILL CONNECT TO THE SERVER
    // For now, we'll use sample data to show how the results will look
    
    // Simulate a delay (as if we're waiting for server response)
    setTimeout(() => {
        displaySampleResults(requestData);
    }, 1000);

    // WHEN YOUR BACKEND IS READY, REPLACE THE ABOVE CODE WITH:
    /*
    fetch('/api/searchCottages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data, bookerName);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('cottageList').innerHTML = 
            '<p style="color: red;">An error occurred while searching. Please try again.</p>';
    });
    */
}

// Function to display sample results (for demonstration)
function displaySampleResults(requestData) {
    // Sample cottage data - this will be replaced by real data from backend
    const sampleCottages = [
        {
            cottageID: "C001",
            address: "123 Lake Road, Jyväskylä, Finland",
            imageURL: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400",
            capacity: 6,
            numberOfBedrooms: 3,
            distanceToLake: 50,
            cityName: "Jyväskylä",
            distanceToCity: 5000
        },
        {
            cottageID: "C002",
            address: "456 Forest Path, Muurame, Finland",
            imageURL: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400",
            capacity: 4,
            numberOfBedrooms: 2,
            distanceToLake: 200,
            cityName: "Muurame",
            distanceToCity: 2000
        }
    ];

    displayResults(sampleCottages, requestData.bookerName, requestData.startDate, requestData.numDays);
}

// Function to display the results on the page
function displayResults(cottages, bookerName, startDate, numDays) {
    const cottageList = document.getElementById('cottageList');
    
    if (cottages.length === 0) {
        cottageList.innerHTML = '<p>No cottages found matching your criteria. Please try adjusting your search parameters.</p>';
        return;
    }

    // Calculate end date
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + parseInt(numDays));
    const endDate = end.toISOString().split('T')[0];

    let html = '';
    cottages.forEach((cottage, index) => {
        const bookingNumber = 'BK' + Date.now() + '-' + (index + 1);
        
        html += `
            <div class="cottage-card">
                <img src="${cottage.imageURL}" alt="Cottage ${cottage.cottageID}" class="cottage-image" 
                     onerror="this.src='https://via.placeholder.com/400x200/667eea/ffffff?text=Cottage+Image'">
                <div class="cottage-info">
                    <h3>${cottage.address}</h3>
                    <div class="booking-number">Booking #${bookingNumber}</div>
                    
                    <div class="info-item">
                        <span class="info-label">Booker:</span>
                        <span class="info-value">${bookerName}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Capacity:</span>
                        <span class="info-value">${cottage.capacity} people</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Bedrooms:</span>
                        <span class="info-value">${cottage.numberOfBedrooms}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Distance to Lake:</span>
                        <span class="info-value">${cottage.distanceToLake} meters</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Nearest City:</span>
                        <span class="info-value">${cottage.cityName}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Distance to City:</span>
                        <span class="info-value">${cottage.distanceToCity} meters</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Booking Period:</span>
                        <span class="info-value">${startDate} to ${endDate}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    cottageList.innerHTML = html;
}

// Helper function to format dates nicely
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}