// Replace with your Google Sheet ID and API key
const SHEET_ID = "your_google_sheet_id"; // Example: "1abcdEFG12345hijkL6789mnopQRS"
const API_KEY = "your_google_api_key";   // Example: "AIzaSyXXXXXXX"

// Fetch data from Google Sheets
async function fetchPlayerStats() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
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
  if (playerStats && playerStats.length > 1) {
    renderStats(playerStats);
  } else {
    document.getElementById("statsContainer").innerHTML = "<p>No data found</p>";
  }
}

init();
