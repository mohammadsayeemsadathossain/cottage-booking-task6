// Backend API Configuration
// Change this URL to match your backend server location
const API_BASE_URL = 'http://localhost:9090/demo/api';

/**
 * Main function called when user clicks "Search Available Cottages"
 * Collects form data and sends request to backend
 */
function searchCottages() {
    // Get all input values from the form
    const bookerName = document.getElementById('bookerName').value.trim();
    const numPeople = document.getElementById('numPeople').value;
    const numBedrooms = document.getElementById('numBedrooms').value;
    const maxDistLake = document.getElementById('maxDistLake').value;
    const city = document.getElementById('city').value.trim();
    const maxDistCity = document.getElementById('maxDistCity').value;
    const numDays = document.getElementById('numDays').value;
    const startDate = document.getElementById('startDate').value;
    const dateShift = document.getElementById('dateShift').value;

    // Validate required fields (city is optional)
    if (!bookerName || !numPeople || !numBedrooms || !maxDistLake || 
        !maxDistCity || !numDays || !startDate || dateShift === '') {
        alert('Please fill in all required fields before searching!');
        return;
    }

    // Convert date from YYYY-MM-DD to DD.MM.YYYY format for backend
    const formattedStartDate = formatDateForBackend(startDate);

    // Build query parameters for the backend API
    const queryParams = new URLSearchParams({
        requiredPlaces: parseInt(numPeople),
        requiredBedrooms: parseInt(numBedrooms),
        maxLakeDistanceMeters: parseInt(maxDistLake),
        maxCityDistanceMeters: parseInt(maxDistCity),
        startDay: formattedStartDate,
        requiredDays: parseInt(numDays),
        maxStartShiftDays: parseInt(dateShift)
    });

    // Add optional bookerName and city if provided
    if (bookerName) {
        queryParams.append('bookerName', bookerName);
    }
    if (city) {
        queryParams.append('city', city);
    }

    // Show results section and loading message
    document.getElementById('results').style.display = 'block';
    document.getElementById('cottageList').innerHTML = `
        <div class="loading-message">
            <div class="loading-spinner"></div>
            <p>Searching for available cottages...</p>
        </div>
    `;

    // Disable the search button while loading
    const searchBtn = document.querySelector('.submit-btn');
    searchBtn.disabled = true;
    searchBtn.querySelector('.btn-text').style.display = 'none';
    searchBtn.querySelector('.btn-loader').style.display = 'inline-block';

    // Make API call to backend
    fetch(`${API_BASE_URL}/cottages/suggestions?${queryParams.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Display the results
            displayResults(data, bookerName);
        })
        .catch(error => {
            console.error('Error fetching cottage suggestions:', error);
            document.getElementById('cottageList').innerHTML = `
                <div class="error-message">
                    <strong>Error:</strong> Unable to connect to the server. 
                    Please make sure the backend is running on ${API_BASE_URL}.
                    <br><br>
                    Error details: ${error.message}
                </div>
            `;
        })
        .finally(() => {
            // Re-enable the search button
            searchBtn.disabled = false;
            searchBtn.querySelector('.btn-text').style.display = 'inline-block';
            searchBtn.querySelector('.btn-loader').style.display = 'none';
        });
}

/**
 * Convert date from YYYY-MM-DD to DD.MM.YYYY format
 */
function formatDateForBackend(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}

/**
 * Convert date from YYYY-MM-DD to a readable format
 */
function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Display the cottage search results
 */
function displayResults(suggestions, bookerName) {
    const cottageList = document.getElementById('cottageList');
    
    if (!suggestions || suggestions.length === 0) {
        cottageList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #7f8c8d;">
                <h3>No cottages found</h3>
                <p>No cottages match your search criteria. Try adjusting your filters:</p>
                <ul style="text-align: left; display: inline-block; margin-top: 15px;">
                    <li>Increase the maximum distance to lake or city</li>
                    <li>Reduce the number of required bedrooms</li>
                    <li>Increase date flexibility</li>
                    <li>Try different dates</li>
                </ul>
            </div>
        `;
        return;
    }

    // Generate HTML for each cottage suggestion
    let html = '';
    suggestions.forEach((suggestion, index) => {
        // Generate a unique booking number for display
        const bookingNumber = 'BK' + Date.now() + '-' + (index + 1);
        
        // Format dates for display
        const startDateDisplay = formatDateForDisplay(suggestion.startDate);
        const endDateDisplay = formatDateForDisplay(suggestion.endDate);
        
        html += `
            <div class="cottage-card">
                <img src="${suggestion.imageURL}" 
                     alt="Cottage ${suggestion.cottageID}" 
                     class="cottage-image" 
                     onerror="this.src='https://via.placeholder.com/400x220/3498db/ffffff?text=Cottage+Image'">
                <div class="cottage-info">
                    <h3>${suggestion.address}</h3>
                    <div class="booking-number">Suggestion #${bookingNumber}</div>
                    
                    ${bookerName ? `
                    <div class="info-item">
                        <span class="info-label">Booker Name:</span>
                        <span class="info-value">${bookerName}</span>
                    </div>
                    ` : ''}
                    
                    <div class="info-item">
                        <span class="info-label">Cottage ID:</span>
                        <span class="info-value">${suggestion.cottageID}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Capacity:</span>
                        <span class="info-value">${suggestion.capacity} people</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Bedrooms:</span>
                        <span class="info-value">${suggestion.numberOfBedrooms}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Distance to Lake:</span>
                        <span class="info-value">${suggestion.distanceToLake} meters</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Nearest City:</span>
                        <span class="info-value">${suggestion.cityName}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Distance to City:</span>
                        <span class="info-value">${suggestion.distanceToCity} meters</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Check-in Date:</span>
                        <span class="info-value">${startDateDisplay}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Check-out Date:</span>
                        <span class="info-value">${endDateDisplay}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Duration:</span>
                        <span class="info-value">${calculateDuration(suggestion.startDate, suggestion.endDate)} nights</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    cottageList.innerHTML = html;
    
    // Smooth scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Calculate duration between two dates in nights
 */
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Set minimum date to today for the date input
 */
window.addEventListener('DOMContentLoaded', () => {
    const startDateInput = document.getElementById('startDate');
    const today = new Date().toISOString().split('T')[0];
    startDateInput.setAttribute('min', today);
    
    // Set default date to 7 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    startDateInput.value = defaultDate.toISOString().split('T')[0];
});