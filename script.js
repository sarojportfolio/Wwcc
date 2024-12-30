// Google Sheets API configuration
const SHEET_ID = "141Ea_xHBXPi6rItn07EiJMrUjVU7m9AFP8HFJi-Dm8I"; // Your Google Sheet ID
const API_KEY = "AIzaSyC-6zotQucEYLuPsNY-3zwFPnTA_wlgzMs"; // Your API key
const EVENT_RANGE = "Sheet2!A2:C"; // Range where the event details are stored
const PLAYER_RANGE = "Sheet2!A5:F"; // Range where player data starts from row 5

// Function to fetch event details from Google Sheets
async function fetchEventDetails() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${EVENT_RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.values && data.values.length > 0) {
      const eventDetails = data.values[0]; // Assuming the first row has event details
      const eventName = eventDetails[0] || "Event Name Not Found";
      const gameDate = eventDetails[1] || "Game Date Not Found";
      const day = eventDetails[2] || "Day Not Found";

      // Update the event details on the page
      updateEventDetails(eventName, gameDate, day);
    } else {
      console.warn("No event details found in the specified range.");
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
  }
}

// Function to fetch player stats from Google Sheets
async function fetchPlayerStats() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${PLAYER_RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.values) {
      return data.values.map(row => ({
        name: row[0] || "Unknown", 
        totalElims: row[1] || "0", 
        elimsContribution: row[2] || "0%", 
        damageDealt: row[3] || "0", 
        avgSurvival: row[4] || "00:00", 
        image: row[5] || "https://via.placeholder.com/80x120", 
      }));
    } else {
      console.warn("No player data found in the specified range.");
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
  container.innerHTML = ""; 

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
  // Fetch event details and update
  await fetchEventDetails();

  // Fetch and render player stats
  const players = await fetchPlayerStats();
  renderPlayerCards(players);
}

// Run the initialization
init();
