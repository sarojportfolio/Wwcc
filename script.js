// Google Sheets API configuration
const SHEET_ID = "141Ea_xHBXPi6rItn07EiJMrUjVU7m9AFP8HFJi-Dm8I"; // Replace with your Google Sheet ID
const API_KEY = "AIzaSyC-6zotQucEYLuPsNY-3zwFPnTA_wlgzMs"; // Replace with your API key

// Range for player data in Sheet 2
const PLAYER_RANGE = "BOOYAH TEAM !A2:F"; // Adjust to your player data range

// Range for event details in Sheet 3
const EVENT_RANGE = "EVENTMANAGE!A2:C"; // Adjust to your event details range

// Function to fetch player stats from Google Sheets (Sheet 2)
async function fetchPlayerStats() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${PLAYER_RANGE}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.values) {
      return data.values.map(row => ({
        name: row[0] || "Unknown",           // Player Name
        totalElims: row[1] || "0",           // Total Elims
        elimsContribution: row[2] || "0%",   // Elims Contribution (%)
        damageDealt: row[3] || "0",          // Damage
        avgSurvival: row[4] || "00:00",      // Avg Survival
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

// Function to fetch event details from Google Sheets (Sheet 3)
async function fetchEventDetails() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${EVENT_RANGE}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.values && data.values.length > 0) {
      const eventData = data.values[0];  // Assuming event details are in the first row
      return {
        eventName: eventData[0] || "Event Name",
        eventStage: eventData[1] || "Stage",
        eventDay: eventData[2] || "Day"
      };
    } else {
      console.warn("No event data found in the specified range.");
      return {
        eventName: "Event Name",
        eventStage: "Stage",
        eventDay: "Day"
      };
    }
  } catch (error) {
    console.error("Error fetching event details from Google Sheets:", error);
    return {
      eventName: "Event Name",
      eventStage: "Stage",
      eventDay: "Day"
    };
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
function updateEventDetails(eventName, eventStage, eventDay) {
  document.getElementById("eventTitle").textContent = eventName;
  document.getElementById("eventStage").textContent = eventStage;
  document.getElementById("eventDay").textContent = eventDay;
}

// Initialization function
async function init() {
  // Fetch and render event details
  const eventDetails = await fetchEventDetails();
  updateEventDetails(eventDetails.eventName, eventDetails.eventStage, eventDetails.eventDay);

  // Fetch and render player stats
  const players = await fetchPlayerStats();
  renderPlayerCards(players);
}

// Run the initialization
init();
