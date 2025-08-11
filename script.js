const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpPHxcZVyfVJQPZeOpwSdHvLWYfLCBhddV7_Eva61DL75q-oUE0QSne_ds6HlDW9Fy0IMr9h0880Ww/pub?output=csv";

let fetching = false;

async function fetchData() {
  if (fetching) return;  // prevent overlapping fetches
  fetching = true;
  try {
    const res = await fetch(sheetURL);
    const text = await res.text();

    // Split into rows and columns
    let rows = text.trim().split("\n").map(r => r.split(","));

    // Remove header row(s) and blank rows
    rows = rows.filter(row => row.join("").trim() !== "" && !row[0].includes("PlayerName"));

    // Player A = first data row
    const playerA = rows[0];
    document.getElementById("nameA").textContent = playerA[0];
    document.getElementById("imgA").src = playerA[1] || "defaultA.png";
    document.getElementById("elimsA").textContent = playerA[2];
    document.getElementById("knocksA").textContent = playerA[3];
    document.getElementById("damageA").textContent = playerA[4];
    document.getElementById("survA").textContent = playerA[5];
    document.getElementById("throwA").textContent = playerA[6];

    // Player B = second data row
    const playerB = rows[1];
    document.getElementById("nameB").textContent = playerB[0];
    document.getElementById("imgB").src = playerB[1] || "defaultB.png";
    document.getElementById("elimsB").textContent = playerB[2];
    document.getElementById("knocksB").textContent = playerB[3];
    document.getElementById("damageB").textContent = playerB[4];
    document.getElementById("survB").textContent = playerB[5];
    document.getElementById("throwB").textContent = playerB[6];

  } catch (err) {
    console.error("Error fetching sheet data:", err);
  } finally {
    fetching = false;
  }
}

// Initial fetch, then refresh every 1 second
fetchData();
setInterval(fetchData, 1000);
