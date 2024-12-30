// Google Sheets API URL
const sheetId = '141Ea_xHBXPi6rItn07EiJMrUjVU7m9AFP8HFJi-Dm8I'; // Your Google Sheet ID
const range = 'Sheet2!A:F'; // Range (adjust as necessary)
const apiKey = 'AIzaSyAhytWe5enZPUd0hiiIrAN8ZbhpO4nbcrs'; // Your Google API Key

// Construct the Google Sheets API URL dynamically
const leaderboardUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

// Fetch data from Google Sheets
async function fetchPlayerStats() {
  try {
    const response = await fetch(leaderboardUrl);
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

// Auto-refresh the data every 1 second
setInterval(init, 1000); // 1 second (1000 milliseconds)

// Run the function initially when the page loads
init();
