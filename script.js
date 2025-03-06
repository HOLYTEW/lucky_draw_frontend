// script.js
document.addEventListener('DOMContentLoaded', init);

let prizes = []; // Array to hold prize data
let interval; // For carousel rotation
let rotating = false; // Carousel state

// Function to open the modal with prize details
function showModal() {
    let modal = document.getElementById("modal");
    modal.style.display = "block";
  }
  
  // Function to close the modal
  function closeModal() {
    let modal = document.getElementById("modal");
    modal.style.display = "none";

    location.reload();
  }
  

  // Attach close event to the close button
document.querySelector('.close-button').addEventListener('click', closeModal);
async function fetchPrizes() {
   
    let settings = {
      "url": "https://lucky-draw-backend-final.onrender.com/getAll",
      "method": "GET",
      "headers": {
        "ngrok-skip-browser-warning": "69420",
        "Accept": "text/event-stream, text/plain"
      },
      "timeout": 0,
  };
  
  await $.ajax(settings).done(function (response) {
      prizes = response;
      console.log(response);
  });
  
}

function updateCarousel() {
    const carousel = document.getElementById('prizeCarousel');
    carousel.innerHTML = ''; // Clear current contents

    prizes.slice(0, 5).forEach((prize, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${prize.prize_cover}" alt="Prize">

        `;
        carousel.appendChild(card);
    });
}

function startStopCarousel() {
    const btn = document.getElementById('startStopBtn');
    if (!rotating) {
        // Start rotation
        interval = setInterval(() => {
            prizes.push(prizes.shift()); // Rotate prizes
            updateCarousel();
        }, 200); // Adjust time for rotation speed
        btn.textContent = 'หยุด';
    } else {
        // Stop rotation and select prize
        clearInterval(interval);
        selectPrize();
        btn.textContent = 'เริ่มสุ่ม';
    }
    rotating = !rotating;
}

function selectPrize() {
    // Select a random prize from the first 5
    const selectedPrize = prizes[Math.floor(Math.random() * Math.min(5, prizes.length))];

    let settings = {
        "url": "https://lucky-draw-backend-final.onrender.com/selectedPrize",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
          "id": selectedPrize.id
        }
      };
      
      $.ajax(settings).done(function (response) {
        // console.log(response);
      });


    document.querySelector('.modal-image').src = selectedPrize.prize_image; // Assuming 'data.imageUrl' is the path to your image
    document.querySelector('.modal-content p').textContent = `ท่านได้รับ ${selectedPrize.prize_name}`; // Assuming 'data.title' is your modal title

    showModal();
}

// Update in init function
function init() {
    fetchPrizes().then(() => {
        updateCarousel();
        document.getElementById('startStopBtn').addEventListener('click', startStopCarousel);
        // Make the modal visible at the beginning for demonstration purposes
    });
}

// Call the init function at the end of the script.js file
init();