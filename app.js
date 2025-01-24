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
let quantity = Number(localStorage.getItem("originalUpgrade.quantity")) || 0;
let originalUpgrade = JSON.parse(localStorage.getItem("originalUpgrade")) || [];


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
  // document.querySelector(".quantity").textContent = `Quantity: ${quantity}`;
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
    
    // Create upgrade element
    const upgradeElement = document.createElement("div");
    
    upgradeElement.classList.add("upgrade"); //for css style
    
    // Add upgrade title and cost
    upgradeElement.innerHTML = `
    <h3>${upgrade.name}</h3>
    <p>Cost: 🍪${upgrade.cost}</p>
    <p>Effect: +${upgrade.increase} cps</p>
    <p class="quantity">Quantity: 0</p>
    <button class='buy-upgrade'>buy</button>`;
    
    // Handle upgrade purchase
    upgradeElement
    .querySelector(".buy-upgrade")
    .addEventListener("click", function () {
      if (cookies >= upgrade.cost) {
        cookies = cookies - upgrade.cost;
        cps += upgrade.increase;
        
        // Update quantity of upgrade
        const originalUpgrade = upgrades.find((target) => target.id === upgrade.id);
        console.log("originalUpgrade", originalUpgrade);

        originalUpgrade.quantity = originalUpgrade.quantity ? originalUpgrade.quantity + 1 : 1;
        
        // Update the quantity display
        upgradeElement.querySelector(".quantity").textContent = `Quantity: ${originalUpgrade.quantity}`;
        updateDisplay();
        
        // Update local storage
        localStorage.setItem("originalUpgrade",JSON.stringify(originalUpgrade.quantity));
        // localStorage.setItem("targetID", JSON.stringify(originalUpgrade.id));
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
  const gameState = {
    cookies: cookies,
    cps: cps,
    quantity: originalUpgrade,
  };

  console.log(gameState)
  // localStorage.setItem("cookies", cookies);
  // localStorage.setItem("cps", cps);
  // localStorage.setItem("originalUpgrade", originalUpgrade);
  localStorage.setItem("gameState", JSON.stringify(gameState));
}

function loadGameState() {
  const savedState = localStorage.getItem("gameState");
  if (savedState){
    const gameStated = JSON.parse(savedState);
    cookies = gameStated.cookies;
    cps = gameStated.cps;
    quantity = gameStated.quantity;
    
    // displayUpgrades(originalUpgrade);
  }
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
