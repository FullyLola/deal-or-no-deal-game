const values = [
  0.01,1,5,10,25,50,75,100,200,300,400,500,
  750,1000,5000,10000,25000,50000,75000,100000,
  200000,300000,400000,500000,750000,1000000
];

let shuffled = [];
let opened = [];
let playerCase = null;

let round = 0;
const roundSteps = [6,5,4,3,2,1];
let casesOpenedThisRound = 0;

/* ---------------- START ---------------- */
function startGame() {
  shuffled = [...values].sort(() => Math.random() - 0.5);
  opened = [];
  playerCase = null;

  round = 0;
  casesOpenedThisRound = 0;

  document.getElementById("controls").style.display = "none";
  document.getElementById("endgame").style.display = "none";

  renderCases();
  updateRound();
  updateCounter();
  updateTracker();
}

/* ---------------- CASES ---------------- */
function renderCases() {
  const casesDiv = document.getElementById("cases");
  casesDiv.innerHTML = "";

  shuffled.forEach((value, index) => {
    let div = document.createElement("div");
    div.className = "case";
    div.innerText = index + 1;

    div.onclick = () => handleCaseClick(index, div);

    casesDiv.appendChild(div);
  });
}

/* ---------------- CLICK ---------------- */
function handleCaseClick(index, div) {
  if (opened.includes(index)) return;

  if (playerCase === null) {
    playerCase = index;
    div.classList.add("player-case");
    div.innerText = "YOUR CASE";
    updateTracker();
    return;
  }

  if (index === playerCase) return;

  opened.push(index);
  casesOpenedThisRound++;

  div.classList.add("opened");
  div.innerText = "$" + shuffled[index];

  document.getElementById("revealSound").play();

  updateCounter();
  updateTracker();

  if (casesOpenedThisRound >= roundSteps[round]) {
    makeOffer();
  }
}

/* ---------------- COUNTER ---------------- */
function updateCounter() {
  document.getElementById("counter").innerText =
    "Cases opened this round: " + casesOpenedThisRound;
}

/* ---------------- BANKER ---------------- */
function makeOffer() {
  let remaining = shuffled.filter((_, i) =>
    !opened.includes(i) && i !== playerCase
  );

  let sum = remaining.reduce((a, b) => a + b, 0);
  let avg = sum / remaining.length;

  let progression = round / (roundSteps.length - 1);
  let multiplier = 0.08 + Math.pow(progression, 2) * 0.95;

  let offer = avg * multiplier;

  if (remaining.length <= 5) {
    offer = avg * 1.1;
  }

  offer = Math.round(offer);

  document.getElementById("offer").innerText =
    "Banker Offer: $" + offer;

  document.getElementById("controls").style.display = "block";

  document.getElementById("offerSound").play();
}

/* ---------------- DEAL ---------------- */
function deal() {
  document.getElementById("finalText").innerText =
    "You took the DEAL!";
  document.getElementById("endgame").style.display = "block";
  document.getElementById("controls").style.display = "none";
}

/* ---------------- NO DEAL ---------------- */
function noDeal() {
  round++;
  casesOpenedThisRound = 0;

  updateRound();
  updateCounter();
  updateTracker();

  document.getElementById("controls").style.display = "none";

  if (round >= roundSteps.length) {
    document.getElementById("endgame").style.display = "block";
  }
}

/* ---------------- ROUND ---------------- */
function updateRound() {
  document.getElementById("round").innerText =
    "Round " + (round + 1) +
    " (Open " + roundSteps[round] + " cases)";
}

/* ---------------- SWAP ---------------- */
function swapCase() {
  let remaining = shuffled.filter((_, i) =>
    !opened.includes(i)
  );

  if (remaining.length !== 2) {
    alert("Swap only allowed when 2 cases remain!");
    return;
  }

  let other = remaining.find(v => v !== shuffled[playerCase]);

  alert("You swapped and won $" + other);
}

/* ---------------- FINAL ---------------- */
function revealFinal() {
  alert("Your case contained $" + shuffled[playerCase]);
}

/* ---------------- RESET ---------------- */
function resetGame() {
  startGame();
}

/* ---------------- TRACKER ---------------- */
function updateTracker() {
  let sorted = [...values];

  let mid = Math.ceil(sorted.length / 2);

  let low = sorted.slice(0, mid);
  let high = sorted.slice(mid);

  const isOpened = (val) =>
    opened.some(i => shuffled[i] === val);

  document.getElementById("lowList").innerHTML =
    low.map(v =>
      `<li class="${isOpened(v) ? "crossed" : ""}">$${v}</li>`
    ).join("");

  document.getElementById("highList").innerHTML =
    high.map(v =>
      `<li class="${isOpened(v) ? "crossed" : ""}">$${v}</li>`
    ).join("");
}

/* ---------------- INIT ---------------- */
startGame();
