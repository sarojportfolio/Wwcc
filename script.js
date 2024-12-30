// Google Sheets API configuration
const SHEET_ID = "141Ea_xHBXPi6rItn07EiJMrUjVU7m9AFP8HFJi-Dm8I"; // Replace with your Google Sheet ID
const API_KEY = "AIzaSyC-6zotQucEYLuPsNY-3zwFPnTA_wlgzMs"; // Replace with your API key

// Range for event details (title, stage, day)
const EVENT_RANGE = "Sheet2!A1:C1"; // Event Title, Stage, Day in Sheet2 (first row)
// Range for player stats (name, total elims, etc.)
const PLAYER_RANGE = "Sheet2!A2:F"; // Player stats in Sheet2 (starting from row 2)

// Function to fetch event details from Google Sheets
async function fetchEventDetails() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${EVENT_RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.values && data.values.length > 0) {
      const [eventTitle, eventStage, eventDay] = data.values[0];
      return {
        title: eventTitle || "Unknown Event",
        stage: eventStage || "Unknown Stage",
        day: eventDay || "Unknown Day"
      };
    } else {
      console.warn("No event details found in the specified range.");
      return {};
    }
  } catch (error) {
    console.error("Error fetching event details from Google Sheets:", error);
    return {};
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
        name: row[0] || "Unknown", // NAME
        totalElims: row[1] || "0", // Total Elims
        elimsContribution: row[2] || "0%", // Elims Contribution (%)
        damageDealt: row[3] || "0", // Damage
        avgSurvival: row[4] || "00:00", // Avg Survival
        image: row[5] || "https://via.placeholder.com/80x120", // Player Image URL
      }));
    } else {
      console.warn("No player data found in the specified range.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching player stats from Google Sheets:", error);
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

// Function to update event details dynamically on the page
function updateEventDetails(eventDetails) {
  const { title, stage, day } = eventDetails;
  document.getElementById("eventTitle").textContent = title;
  document.getElementById("eventStage").textContent = stage;
  document.getElementById("eventDay").textContent = day;
}

// Initialization function
async function init() {
  // Fetch event details from Google Sheets
  const eventDetails = await fetchEventDetails();
  if (eventDetails.title) {
    // Update event details on the page
    updateEventDetails(eventDetails);
  } else {
    console.error("Failed to fetch event details.");
  }

  // Fetch player stats from Google Sheets
  const players = await fetchPlayerStats();
  if (players.length > 0) {
    // Render player stats as cards
    renderPlayerCards(players);
  } else {
    document.getElementById("teamStatusContainer").innerHTML = "<p>No player stats found</p>";
  }
}

// Run the initialization
init();
