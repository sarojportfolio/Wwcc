// Google Sheets API configuration
const SHEET_ID = "141Ea_xHBXPi6rItn07EiJMrUjVU7m9AFP8HFJi-Dm8I"; // Replace with your Google Sheet ID
const API_KEY = "AIzaSyC-6zotQucEYLuPsNY-3zwFPnTA_wlgzMs"; // Replace with your API key
const RANGE = "Sheet2!A2:F"; // Adjust to your sheet range

// Function to fetch player stats from Google Sheets
async function fetchPlayerStats() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Check if data exists and map it to objects
    if (data.values) {
      return data.values.map(row => ({
        name: row[0] || "Unknown", // NAME
        totalElims: row[1] || "0", // Total Elims
        elimsContribution: row[2] || "0%", // Elims Contribution (%)
        damageDealt: row[3] || "0", // Damage
        avgSurvival: row[4] || "00:00", // Avg Survival
        image: row[5] || "https://via.placeholder.com/80x120", // Player Image URL
      }));
    } else {
      console.warn("No data found in the specified range.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    return [];
  }
}

// Function to render player cards
function renderPlayerCards(players) {
  const container = document.getElementById("teamStatusContainer");
  container.innerHTML = ""; // Clear existing content

  players.forEach(player => {
    const card = document.createElement("div");
    card.classList.add("player-card");

    card.innerHTML = `
      <img src="${player.image}" alt="${player.name}" class="player-image">
      <h3 class="player-name">${player.name}</h3>
      <div class="stats">
        <p>Total Elims: <span>${player.totalElims}</span></p>
        <p>Elims Contribution: <span>${player.elimsContribution}</span></p>
        <p>Damage Dealt: <span>${player.damageDealt}</span></p>
        <p>Avg Survival: <span>${player.avgSurvival}</span></p>
      </div>
    `;

    container.appendChild(card);
  });
}

// Function to update event details
function updateEventDetails(title, stage, day) {
  document.getElementById("eventTitle").textContent = title;
  document.getElementById("eventStage").textContent = stage;
  document.getElementById("eventDay").textContent = day;
}

// Initialization function
async function init() {
  // Update event details
  updateEventDetails("WWCD TEAM STATUS", "GRAND FINALS", "DAY - 3");

  // Fetch and render player stats
  const players = await fetchPlayerStats();
  renderPlayerCards(players);
}

// Run the initialization
init();
