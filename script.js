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

// START GAME
function startGame() {
  shuffled = [...values].sort(() => Math.random() - 0.5);
  opened = [];
  playerCase = null;
  round = 0;
  casesOpenedThisRound = 0;

  document.getElementById("endgame").style.display = "none";
  document.getElementById("controls").style.display = "none";

  renderCases();
  updateRound();
}

// RENDER CASES
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

// CLICK CASE
function handleCaseClick(index, div) {
  if (opened.includes(index)) return;

  // choose player case first
  if (playerCase === null) {
    playerCase = index;
    div.classList.add("player-case");
    div.innerText = "YOUR CASE";
    return;
  }

  if (index === playerCase) return;

  opened.push(index);
  casesOpenedThisRound++;

  div.classList.add("opened");
  div.innerText = "$" + shuffled[index];

  document.getElementById("revealSound").play();

  if (casesOpenedThisRound >= roundSteps[round]) {
    makeOffer();
  }
}

// BANKER OFFER (your formula)
function makeOffer() {
  let remaining = shuffled.filter((_, i) =>
    !opened.includes(i) && i !== playerCase
  );

  let sum = remaining.reduce((a, b) => a + b, 0);
  let count = remaining.length;

  let avg = sum / count;

  // YOUR SPECIFIED FORMULA
  let offer = (avg / count) * (round / 9);

  offer = Math.round(offer);

  document.getElementById("offer").innerText =
    "Banker Offer: $" + offer;

  document.getElementById("controls").style.display = "block";

  document.getElementById("offerSound").play();
}

// DEAL
function deal() {
  document.getElementById("finalText").innerText =
    "You took the DEAL!";
  document.getElementById("endgame").style.display = "block";
  document.getElementById("controls").style.display = "none";
}

// NO DEAL
function noDeal() {
  round++;
  casesOpenedThisRound = 0;

  updateRound();
  document.getElementById("controls").style.display = "none";

  if (round >= roundSteps.length) {
    document.getElementById("endgame").style.display = "block";
  }
}

// ROUND UI
function updateRound() {
  document.getElementById("round").innerText =
    "Round " + (round + 1) +
    " (Open " + roundSteps[round] + " cases)";
}

// SWAP FINAL CASE
function swapCase() {
  let remaining = shuffled.filter((_, i) =>
    !opened.includes(i) && i !== playerCase
  );

  alert("You swapped and won $" + remaining[0]);
}

// KEEP CASE
function revealFinal() {
  alert("Your case contained $" + shuffled[playerCase]);
}

// RESET
function resetGame() {
  startGame();
}

startGame();
