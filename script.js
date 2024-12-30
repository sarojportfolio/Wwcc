// Replace with your Google Sheet ID and API key
const SHEET_ID = "141Ea_xHBXPi6rItn07EiJMrUjVU7m9AFP8HFJi-Dm8I"; // Your Google Sheet ID
const API_KEY = "AIzaSyC-6zotQucEYLuPsNY-3zwFPnTA_wlgzMs"; // Your Google API key

// Specify the range for data in Sheet2
const RANGE = "Sheet2!A:F"; // Range for the data in Sheet2 (adjust columns and rows if needed)

// Fetch data from Google Sheets
async function fetchPlayerStats() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched Data:", data); // Debugging: Log API response
    if (!data.values || data.values.length === 0) {
      console.error("No data returned from the API.");
      return [];
    }
    return data.values; // Returns array of rows
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Render the stats on the page
function renderStats(data) {
  const container = document.getElementById("statsContainer");
  container.innerHTML = ""; // Clear previous content

  // Skip the first row (headers) and generate player cards
  data.slice(1).forEach((player) => {
    const [name, totalElims, elimsContribution, damage, avgSurvival, playerImageUrl] = player;

    // Create a card element
    const card = document.createElement("div");
    card.classList.add("card");

    // Populate card HTML
    card.innerHTML = `
      <img src="${playerImageUrl}" alt="${name}" class="player-image">
      <h3>${name}</h3>
      <div class="stat">Total Elims: <span>${totalElims}</span></div>
      <div class="stat">Elims Contribution: <span>${elimsContribution}%</span></div>
      <div class="stat">Damage Dealt: <span>${damage}</span></div>
      <div class="stat">Avg Survival: <span>${avgSurvival}</span></div>
    `;

    // Append card to container
    container.appendChild(card);
  });
}

// Initialize the app
async function init() {
  const playerStats = await fetchPlayerStats();
  const container = document.getElementById("statsContainer");

  if (playerStats && playerStats.length > 1) {
    renderStats(playerStats);
  } else {
    container.innerHTML = "<p>No data found or failed to fetch data.</p>";
  }
}

init();
