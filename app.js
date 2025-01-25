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
let cookies = Number(localStorage.getItem("cookies")) || 100;
let cps = Number(localStorage.getItem("cps")) || 1;
let newUpgrade = JSON.parse(localStorage.getItem("newUpgrade")) || [];

// Function to update and display values
function updateDisplay() {
  cookieDisplay.textContent = cookies;
  cpsDisplay.textContent = cps;
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
  cookies = 100;
  cps = 1;
  quantity = 0;
  updateDisplay();
  localStorage.clear();
});

// UPGRADES
// Fetch upgrade from API
async function fetchUpgrades() {
  try {
    const response = await fetch(
      "https://cookie-upgrade-api.vercel.app/api/upgrades"
    );
    const upgrades = await response.json();
    // console.log(upgrades)
    displayUpgrades(upgrades); // iterates through the fetched upgrades and create a <div> for each upgrade
  } catch (error) {
    console.log("Error fetching upgrades:", error);
  }
}

// Display upgrades in the game
function displayUpgrades(upgrades) {
  upgrades.forEach((upgrade) => {
    // Build-in JavaScript to check if newUpgrade is an array
    if (!Array.isArray(newUpgrade)) newUpgrade = [];

    // Check if this upgrade has saved data
    // Use find() method to find the first element in the newUpgrade array that satisfies the condition
    const savedUpgrade = newUpgrade.find((u) => u.id === upgrade.id);
    console.log("savedUpgrade", savedUpgrade);
    upgrade.quantity = savedUpgrade ? savedUpgrade.quantity : 0;

    // Create upgrade element
    const upgradeElement = document.createElement("div");
    upgradeElement.classList.add("upgrade"); //for css style

    // Add upgrade title and cost
    upgradeElement.innerHTML = `
    <h3>${upgrade.name}</h3>
    <p>Cost: 🍪${upgrade.cost}</p>
    <p>Effect: +${upgrade.increase} cps</p>
    <p class="quantity">Quantity: ${upgrade.quantity}</p>
    <button class='buy-upgrade'>buy</button>`;

    // Handle upgrade purchase
    upgradeElement
      .querySelector(".buy-upgrade")
      .addEventListener("click", function () {
        if (cookies >= upgrade.cost) {
          cookies = cookies - upgrade.cost;
          cps += upgrade.increase;

          // Update quantity of upgrade
          upgrade.quantity = upgrade.quantity ? upgrade.quantity + 1 : 1;

          // Update the browser display
          upgradeElement.querySelector(
            ".quantity"
          ).textContent = `Quantity: ${upgrade.quantity}`;
          updateDisplay();

          // Update newUpgrade array and save to local storage
          const existingUpgradeIndex = newUpgrade.findIndex(
            (u) => u.id === upgrade.id
          );
          if (existingUpgradeIndex !== -1) {
            newUpgrade[existingUpgradeIndex].quantity = upgrade.quantity;
          } else {
            newUpgrade.push({ ...upgrade });
          }
          // console.log(newUpgrade[existingUpgradeIndex]);

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

// Function to save game state to local storage
function saveGameState() {
  localStorage.setItem("cookies", cookies);
  localStorage.setItem("cps", cps);
  localStorage.setItem("newUpgrade", JSON.stringify(newUpgrade));
}

function loadGameState() {
  cookies = Number(localStorage.getItem("cookies")) || 100;
  cps = Number(localStorage.getItem("cps")) || 1;
  newUpgrade = JSON.parse(localStorage.getItem("newUpgrade")) || [];
  updateDisplay();
}

// Fetch upgrades when the game starts
fetchUpgrades();
loadGameState();

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
