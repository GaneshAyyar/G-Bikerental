// Bike inventory (array of objects)
const bikes = [
    { id: 1, model: "Hero Splendor", rentPerHour: 50, isAvailable: true },
    { id: 2, model: "Royal Enfield Classic", rentPerHour: 100, isAvailable: true },
    { id: 3, model: "Bajaj Pulsar", rentPerHour: 70, isAvailable: true },
    { id: 4, model: "Yamaha FZ", rentPerHour: 80, isAvailable: true },
    { id: 5, model: "TVS Apache", rentPerHour: 75, isAvailable: true }
];

// Stack to store recent rentals
let rentalHistoryStack = [];

// Selected bike for rental
let selectedBike = null;

// Load available bikes on rental page
function loadAvailableBikes() {
    const container = document.getElementById('availableBikes');
    container.innerHTML = '';

    bikes.forEach(bike => {
        if (bike.isAvailable) {
            const bikeCard = document.createElement('div');
            bikeCard.className = 'bike-card';
            bikeCard.innerHTML = `
                <h4>${bike.model}</h4>
                <p>Rent per hour: ₹${bike.rentPerHour}</p>
                <button onclick="selectBike(${bike.id})" class="btn">Select</button>
            `;
            container.appendChild(bikeCard);
        }
    });
}

// When user selects a bike
function selectBike(bikeId) {
    selectedBike = bikes.find(bike => bike.id === bikeId);
    alert(`You selected: ${selectedBike.model}`);
}

// Move to next step
function nextStep(currentStep) {
    if (currentStep === 1 && !selectedBike) {
        alert("Please select a bike first!");
        return;
    }
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep + 1}`).classList.add('active');
}

// Go back to previous step
function prevStep(currentStep) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep - 1}`).classList.add('active');
}

// Calculate rent estimate
function calculateRent() {
    const rentalHours = document.getElementById('rentalHours').value;
    if (!selectedBike) {
        alert("No bike selected!");
        return;
    }
    const cost = selectedBike.rentPerHour * rentalHours;
    document.getElementById('estimatedCost').innerText = `₹${cost}`;
}

// Confirm rental
function confirmRental() {
    const customerName = document.getElementById('customerName').value.trim();
    const rentalHours = parseInt(document.getElementById('rentalHours').value);

    if (!customerName || isNaN(rentalHours) || !selectedBike) {
        alert("Please fill all details and select a bike!");
        return;
    }

    const totalCost = selectedBike.rentPerHour * rentalHours;

    // Mark bike as rented
    selectedBike.isAvailable = false;

    // Push to rental history (Stack - LIFO)
    rentalHistoryStack.push({
        customerName: customerName,
        bikeModel: selectedBike.model,
        rentalHours: rentalHours,
        totalCost: totalCost
    });

    // Show confirmation
    document.getElementById('confirmationCard').innerHTML = `
        <h4>Thank you, ${customerName}!</h4>
        <p>Bike: ${selectedBike.model}</p>
        <p>Hours: ${rentalHours} hour(s)</p>
        <p>Total Cost: ₹${totalCost}</p>
    `;

    updateRentalHistory();
    loadAvailableBikes(); // Refresh available bikes
    nextStep(2); // Move to confirmation page
}

// Update recent rental history
function updateRentalHistory() {
    const historyContainer = document.getElementById('rentalHistory');
    historyContainer.innerHTML = '';

    // Display latest 5 rentals
    const recentRentals = rentalHistoryStack.slice(-5).reverse();
    recentRentals.forEach(rental => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <p><strong>${rental.customerName}</strong> rented <em>${rental.bikeModel}</em> for ${rental.rentalHours} hour(s). Total: ₹${rental.totalCost}</p>
        `;
        historyContainer.appendChild(historyItem);
    });
}

// Load bikes if availableBikes div exists (rental.html page)
window.onload = function() {
    if (document.getElementById('availableBikes')) {
        loadAvailableBikes();
    }
};
