// DOM nodes
const cookieBtn = document.getElementById("cookies-btn");
const cookieBtnSound = document.querySelector(".cookie-sound");
const cookieDisplay = document.getElementById("cookies");
const cpsDisplay = document.getElementById("cps");
const resetBtn = document.getElementById("reset-btn");
const warningDisplay = document.getElementById("warning");
const upgradesContainer = document.getElementById("upgrades-container");
const coinSound = document.querySelector(".coin-sound");
const errorSound = document.querySelector(".error-sound");
const backgroundSoundBtn = document.querySelector(".background-sound-btn");
const backgroundSound = document.querySelector(".background-sound");
const volumeControl = document.querySelector(".volume-slider");

// Game state
let cookies = Number(localStorage.getItem("cookies")) || 0;
let cps = Number(localStorage.getItem("cps")) || 1;
let quantity = Number(localStorage.getItem("quantity")) || 0;

// Function to update and display values
function updateDisplay() {
  cookieDisplay.textContent = cookies;
  cpsDisplay.textContent = cps;
}

// Function to save game state to local storage
function saveGameState() {
  localStorage.setItem("cookies", cookies);
  localStorage.setItem("cps", cps);
}

// Initialize display
updateDisplay();

// Game logic
// every second, increase cookies by cps
setInterval(function () {
  cookies = cookies + cps;
  updateDisplay();
  localStorage.setItem("cookies", cookies);
}, 1000);

// get a cookie when cookie button is clicked
cookieBtn.addEventListener("click", function () {
  cookies++;
  updateDisplay();
  cookieBtnSound.play();
});

// event listener to reset the cookies
resetBtn.addEventListener("click", function () {
  clearInterval(cookies);
  cookies = 0;
  cps = 1;
  quantity = 0;
  updateDisplay();
  localStorage.clear();
});

// Upgrades

// Fetch upgrade from API
async function fetchUpgrades() {
  try {
    const response = await fetch(
      "https://cookie-upgrade-api.vercel.app/api/upgrades"
    );
    const upgrades = await response.json();
    displayUpgrades(upgrades); // iterates through the fetched upgrades and create a <div> for each upgrade
  } catch (error) {
    console.log("Error fetching upgrades:", error);
  }
}

// Display upgrades in the game
function displayUpgrades(upgrades) {
  upgrades.forEach((upgrade) => {
    // Create upgrade element
    const upgradeElement = document.createElement("div");
    upgradeElement.classList.add("upgrade");
    // Add upgrade title and cost
    upgradeElement.innerHTML = `
    <h3>${upgrade.name}</h3>
        <p>Cost: 🍪${upgrade.cost}</p>
        <p>Effect: +${upgrade.increase} cps</p>
        <button class='buy-upgrade'>buy</button>`;

    // Handle upgrade purchase
    upgradeElement
      .querySelector(".buy-upgrade")
      .addEventListener("click", function () {
        if (cookies >= upgrade.cost) {
          cookies = cookies - upgrade.cost;
          cps += upgrade.increase;
          updateDisplay();
          saveGameState();
          coinSound.play();
        } else {
          warningDisplay.style.display = "block";
          setTimeout(function () {
            warningDisplay.style.display = "none";
          }, 5000);
          errorSound.play();
        }
      });
    // Append upgrade element to container
    upgradesContainer.appendChild(upgradeElement);
  });
}

// Fetch upgrades when the game starts
fetchUpgrades();

// Background sound
let isPlaying = false;
backgroundSoundBtn.addEventListener("click", function () {
  if (isPlaying == false) {
    backgroundSound.muted = false;
    backgroundSound.play();
    isPlaying = true;
  } else {
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
    isPlaying = false;
  }
});

// Adjust the volume of backgound sound
volumeControl.addEventListener("input", function () {
  backgroundSound.volume = parseFloat(volumeControl.value);
});

// How to play button
function popupFn() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("popupDialog").style.display = "block";
}

function closeFn() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("popupDialog").style.display = "none";
}
