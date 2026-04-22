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

// HANDLE CASE CLICK
function handleCaseClick(index, div) {
  if (opened.includes(index)) return;

  // pick player case first
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

// 🔥 BANKER (REALISTIC GAME CURVE)
function makeOffer() {
  let remaining = shuffled.filter((_, i) =>
    !opened.includes(i) && i !== playerCase
  );

  let sum = remaining.reduce((a, b) => a + b, 0);
  let avg = sum / remaining.length;

  // remaining board value (key improvement)
  let max = Math
