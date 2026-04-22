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

/* START */
function startGame() {
  shuffled = [...values].sort(() => Math.random() - 0.5);
  opened = [];
  playerCase = null;
  round = 0;

  document.getElementById("controls").style.display = "none";
  document.getElementById("endgame").style.display = "none";

  renderCases();
  updateRound();
  updateCounter();
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

/* FINAL PHASE */
function isFinalPhase() {
  let remaining = shuffled.filter((_, i) =>
    !opened.includes(i) && i !== playerCase
  );
  return remaining.length <= 2;
}

/* CLICK */
function handleCaseClick(index, div) {
  if (opened.includes(index)) return;

  if (playerCase === null) {
    playerCase = index;
    div.classList.add("player-case");
    div.innerText = "YOUR";
    updateTracker();
    updateCounter();
    return;
  }

  if (index === playerCase) return;

  opened.push(index);

  div.classList.add("opened");
  div.innerText = "$" + shuffled[index];

  document.getElementById("revealSound").play();

  updateCounter();
  updateTracker();

  if (isFinalPhase()) {
    setTimeout(makeOffer, 300);
  } else if (openedSinceRound() >= roundSteps[round]) {
    makeOffer();
  }
}

/* COUNTER */
function openedSinceRound() {
  let before = roundSteps.slice(0, round).reduce((a,b)=>a+b,0);
  return opened.length - before;
}

function updateCounter() {
  document.getElementById("counter").innerText =
    "Cases opened this round: " + openedSinceRound();
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
  document.getElementById("offerSound").play();
}

/* DEAL */
function deal() {
  document.getElementById("finalText").innerText = "DEAL!";
  document.getElementById("endgame").style.display = "block";
  document.getElementById("controls").style.display = "none";
}

/* NO DEAL */
function noDeal() {
  let remaining = shuffled.filter((_, i) =>
    !opened.includes(i) && i !== playerCase
  );

  if (remaining.length <= 2) {
    document.getElementById("controls").style.display = "none";
    return;
  }

  round++;
  updateRound();
  updateCounter();
  updateTracker();

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
  let remaining = shuffled.filter((_, i) =>
    !opened.includes(i)
  );

  if (remaining.length !== 2) {
    alert("Swap only allowed at final 2 cases!");
    return;
  }

  let other = remaining.find(v => v !== shuffled[playerCase]);
  alert("You won $" + other);
}

/* FINAL */
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
