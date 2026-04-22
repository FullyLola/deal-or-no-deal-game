const values = [
  0.01,1,5,10,25,50,75,100,200,300,400,500,
  750,1000,5000,10000,25000,50000,75000,100000,
  200000,300000,400000,500000,750000,1000000
];

let shuffled = [];
let opened = [];
let playerCase = null;

let round = 0;
const roundSteps = [6,5,4,3,2,1,1,1,1];

let finalPhaseTriggered = false;

/* START */
function startGame() {
  shuffled = [...values].sort(() => Math.random() - 0.5);
  opened = [];
  playerCase = null;
  round = 0;
  finalPhaseTriggered = false;

  document.getElementById("controls").style.display = "none";
  document.getElementById("endgame").style.display = "none";

  renderCases();
  updateRound();
  updateCounter();
  updateRemainingCounter();
  updateTracker();
}

/* RENDER */
function renderCases() {
  const casesDiv = document.getElementById("cases");
  casesDiv.innerHTML = "";

  shuffled.forEach((_, index) => {
    let div = document.createElement("div");
    div.className = "case";
    div.innerText = index + 1;
    div.onclick = () => handleCaseClick(index, div);
    casesDiv.appendChild(div);
  });
}

/* REMAINING */
function getRemainingIndexes() {
  return shuffled.map((_, i) => i)
    .filter(i => !opened.includes(i));
}

/* CLICK */
function handleCaseClick(index, div) {
  if (opened.includes(index)) return;

  if (playerCase === null) {
    playerCase = index;
    div.classList.add("player-case");
    div.innerText = "YOUR";
    updateCounter();
    updateRemainingCounter();
    return;
  }

  if (index === playerCase) return;

  opened.push(index);

  div.classList.add("opened");
  div.innerText = "$" + shuffled[index];

  document.getElementById("revealSound").play();

  updateCounter();
  updateRemainingCounter();
  updateTracker();

  let remaining = getRemainingIndexes();

  if (remaining.length === 3 && !finalPhaseTriggered) {
    finalPhaseTriggered = true;
    alert("Final Round: Open 1 more case!");
    return;
  }

  if (remaining.length === 2) {
    document.getElementById("endgame").style.display = "block";
    return;
  }

  if (openedSinceRound() >= roundSteps[round]) {
    makeOffer();
  }
}

/* COUNTERS */
function openedSinceRound() {
  let before = roundSteps.slice(0, round).reduce((a,b)=>a+b,0);
  return opened.length - before;
}

function updateCounter() {
  document.getElementById("counter").innerText =
    "Cases opened this round: " + openedSinceRound();
}

function updateRemainingCounter() {
  let remaining = shuffled.length - opened.length;
  document.getElementById("remaining").innerText =
    "Unopened cases: " + remaining;
}

/* BANKER */
function makeOffer() {
  let remaining = shuffled.filter((_, i) =>
    !opened.includes(i) && i !== playerCase
  );

  let avg = remaining.reduce((a,b)=>a+b,0) / remaining.length;

  let progression = round / (roundSteps.length - 1);
  let multiplier = 0.08 + Math.pow(progression, 2) * 0.95;

  let offer = avg * multiplier;

  if (remaining.length <= 5) offer = avg * 1.1;

  document.getElementById("offer").innerText =
    "Banker Offer: $" + Math.round(offer);

  document.getElementById("controls").style.display = "block";
}

/* DEAL */
function deal() {
  document.getElementById("finalText").innerText = "DEAL!";
  document.getElementById("endgame").style.display = "block";
}

/* NO DEAL */
function noDeal() {
  let remaining = getRemainingIndexes();

  if (remaining.length <= 3) return;

  round++;
  updateRound();
  updateCounter();

  document.getElementById("controls").style.display = "none";
}

/* ROUND */
function updateRound() {
  document.getElementById("round").innerText =
    "Round " + (round + 1) +
    " (Open " + roundSteps[round] + ")";
}

/* SWAP */
function swapCase() {
  let remaining = getRemainingIndexes();

  if (remaining.length !== 2) {
    alert("Swap only allowed at final 2!");
    return;
  }

  let other = remaining.find(i => i !== playerCase);
  alert("You won $" + shuffled[other]);
}

/* KEEP */
function revealFinal() {
  alert("Your case had $" + shuffled[playerCase]);
}

/* RESET */
function resetGame() {
  startGame();
}

/* TRACKER */
function updateTracker() {
  let sorted = [...values];
  let mid = Math.ceil(sorted.length / 2);

  const isOpened = (val) =>
    opened.some(i => shuffled[i] === val);

  document.getElementById("lowList").innerHTML =
    sorted.slice(0, mid).map(v =>
      `<li class="${isOpened(v) ? "crossed" : ""}">$${v}</li>`
    ).join("");

  document.getElementById("highList").innerHTML =
    sorted.slice(mid).map(v =>
      `<li class="${isOpened(v) ? "crossed" : ""}">$${v}</li>`
    ).join("");
}

/* INIT */
startGame();
