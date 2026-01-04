//========== Show Cards on Campsites=============

const campContainer = document.getElementById("camps");
const locationFilter = document.getElementById("locationFilter");
const typeFilter = document.getElementById("typeFilter");

//  Function to display camps
function displayCamps(filteredCamps) {
   campContainer.innerHTML = ""; // clear previous cards

   filteredCamps.forEach(camp => {
      const card = document.createElement("div");
      card.classList.add("camp-card");

      card.innerHTML = `
      <div class="camp-image">
      <img src="../images/${camp.img}" alt="${camp.name}">
      </div>
      <div class="camp-info">
        <h3>${camp.name}</h3>
        <p class="camp_location"><strong>Location:</strong> ${camp.location}</p>
        <p class="camp_description">${camp.description}</p>
        <p class="camp_price"><strong>Price:</strong> ₹${camp.priceStarting}</p>
               <button type="button" class="book-btn" data-camp="${camp.name}">Book now</button>
        
      </div>
    `;
      //   <div class="flex"></div>

      campContainer.appendChild(card);

         // attach click handler to Book now button to show an alert with the camp name
         const bookBtn = card.querySelector('.book-btn');
         if (bookBtn) {
            bookBtn.addEventListener('click', () => {
               const campName = bookBtn.getAttribute('data-camp') || camp.name;
               alert('Booking requested for "' + campName + '" — you will be redirected to the contact page.');
               // after alert (which is blocking), redirect to contact page and pass camp name in query
               window.location.href = 'contact.html?camp=' + encodeURIComponent(campName);
            });
         }
   });

   // Show a message if no camps match
   if (filteredCamps.length === 0) {
      campContainer.innerHTML = "<p>No camps found for your selection.</p>";
   }
}

//  Fill filter dropdowns dynamically
function populateFilters() {
   const locations = [...new Set(camps.map(c => c.location))];
   const types = [...new Set(camps.map(c => c.type))];

   locations.forEach(loc => {
      const opt = document.createElement("option");
      opt.value = loc;
      opt.textContent = loc;
      locationFilter.appendChild(opt);
   });

   types.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      typeFilter.appendChild(opt);
   });
}

//  Handle filtering logic
function filterCamps() {
   const selectedLocation = locationFilter.value;
   const selectedType = typeFilter.value;

   const filtered = camps.filter(camp => {
      const matchLocation = selectedLocation === "all" || camp.location === selectedLocation;
      const matchType = selectedType === "all" || camp.type === selectedType;
      return matchLocation && matchType;
   });

   displayCamps(filtered);
}

//  Event listeners for filters
locationFilter.addEventListener("change", filterCamps);
typeFilter.addEventListener("change", filterCamps);

// Initialize page
populateFilters();
displayCamps(camps);