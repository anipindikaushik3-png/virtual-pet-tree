// Animated Virtual Pet Tree

const stages = [
  { name: "Seed", branches: 0, leaves: 0 },
  { name: "Sprout", branches: 1, leaves: 2 },
  { name: "Sapling", branches: 2, leaves: 5 },
  { name: "Young Tree", branches: 3, leaves: 10 },
  { name: "Full Tree", branches: 4, leaves: 18 }
];

let treeState = {
  stage: 0,      // 0 = seed, ... 4 = full tree
  health: 10,    // 0-10
  decorations: [],
  lastAction: "",
};

function drawTree() {
  const svg = document.getElementById("tree-svg");
  svg.innerHTML = "";

  // Draw trunk
  svg.innerHTML += `<rect class="trunk" x="140" y="300" width="20" height="70" rx="10" fill="#936639"/>`;

  // Draw branches
  const stage = stages[treeState.stage];
  for (let b = 0; b < stage.branches; b++) {
    const angle = -30 + b * (60 / Math.max(1, stage.branches-1));
    svg.innerHTML += `<rect class="branch" x="150" y="300" width="6" height="70" rx="4"
      fill="#a98467" transform="rotate(${angle}, 150, 300)"/>`;
  }

  // Draw leaves as circles
  for (let l = 0; l < stage.leaves; l++) {
    const angle = 90 + l * (180 / Math.max(1, stage.leaves-1));
    const rad = angle * Math.PI / 180;
    const x = 150 + Math.cos(rad) * (40 + treeState.stage * 10);
    const y = 300 - Math.sin(rad) * (70 + treeState.stage * 10);
    svg.innerHTML += `<circle class="leaf" cx="${x}" cy="${y}" r="${12 + treeState.stage*2}"
      fill="#38b000" stroke="#168000" stroke-width="3" style="opacity:${0.7+0.3*Math.random()}"/>`;
  }
}

function updateStatus() {
  document.getElementById("growth-status").textContent =
    `Growth: ${stages[treeState.stage].name}`;
  document.getElementById("health-status").textContent =
    `Health: ${treeState.health>=7?'😊':treeState.health>=4?'😐':'😢'}`;
  document.getElementById("last-action").textContent = treeState.lastAction;
}

function saveTree() {
  localStorage.setItem("virtualPetTree", JSON.stringify(treeState));
}
function loadTree() {
  const saved = localStorage.getItem("virtualPetTree");
  if (saved) treeState = JSON.parse(saved);
}

function waterTree() {
  treeState.health = Math.min(treeState.health+2, 10);
  treeState.lastAction = "You watered the tree!";
  showWaterDrop();
  setTimeout(() => {
    progressTree();
    update();
  }, 800);
}
function fertilizeTree() {
  treeState.health = Math.min(treeState.health+1, 10);
  treeState.lastAction = "You fertilized the tree!";
  showSparkle();
  setTimeout(() => {
    progressTree(true);
    update();
  }, 800);
}

function progressTree(fertilize=false) {
  // More chance to grow if fertilized
  if (treeState.health >= 5) {
    const chance = fertilize ? 0.7 : 0.4;
    if (Math.random() < chance && treeState.stage < stages.length-1) {
      treeState.stage++;
      treeState.lastAction += " 🌱 It grew!";
      // Animate tree growth
      drawTree();
    }
  }
}

function addDecoration() {
  if (treeState.stage < 2) {
    treeState.lastAction = "Tree is too small for decorations!";
    update();
    return;
  }
  const decoTypes = [
    {emoji: "🌸", x: 200, y: 180},
    {emoji: "🦋", x: 170, y: 120},
    {emoji: "🎈", x: 120, y: 140},
    {emoji: "🍎", x: 230, y: 220},
    {emoji: "🧚", x: 100, y: 180}
  ];
  const deco = decoTypes[Math.floor(Math.random()*decoTypes.length)];
  deco.animate = true;
  treeState.decorations.push(deco);
  treeState.lastAction = `You added a ${deco.emoji}!`;
  update();
  animateDecoration(treeState.decorations.length-1);
}

function drawDecorations() {
  const decoDiv = document.getElementById("decorations");
  decoDiv.innerHTML = "";
  treeState.decorations.forEach((deco, idx) => {
    const elem = document.createElement("span");
    elem.textContent = deco.emoji;
    elem.style.position = "absolute";
    elem.style.left = deco.x + "px";
    elem.style.top = deco.y + "px";
    elem.style.fontSize = "2rem";
    if (deco.animate) {
      elem.classList.add("decoration-animate");
      setTimeout(() => { elem.classList.remove("decoration-animate"); deco.animate = false; }, 700);
    }
    decoDiv.appendChild(elem);
  });
}

function resetTree() {
  treeState = {
    stage: 0,
    health: 10,
    decorations: [],
    lastAction: "Tree was reset.",
  };
  update();
}

// Water drop animation
function showWaterDrop() {
  const dropDiv = document.getElementById("water-drop");
  dropDiv.innerHTML = `<svg viewBox="0 0 22 22"><ellipse cx="11" cy="15" rx="8" ry="7" fill="#00b4d8"/><ellipse cx="11" cy="9" rx="4" ry="7" fill="#48cae4"/></svg>`;
  dropDiv.classList.add("water-drop-animate");
  setTimeout(() => {
    dropDiv.classList.remove("water-drop-animate");
    dropDiv.innerHTML = "";
  }, 1200);
}

// Sparkle animation
function showSparkle() {
  const sparkleDiv = document.getElementById("sparkle");
  sparkleDiv.innerHTML = `<svg viewBox="0 0 40 40">
    <polygon points="20,0 25,15 40,20 25,25 20,40 15,25 0,20 15,15"
      fill="#ffd700" stroke="#fff" stroke-width="2" opacity="0.8"/>
  </svg>`;
  sparkleDiv.classList.add("sparkle-animate");
  setTimeout(() => {
    sparkleDiv.classList.remove("sparkle-animate");
    sparkleDiv.innerHTML = "";
  }, 1100);
}

// Decoration pop animation
function animateDecoration(idx) {
  const decoDiv = document.getElementById("decorations");
  const elem = decoDiv.children[idx];
  if (elem) {
    elem.classList.add("decoration-animate");
    setTimeout(() => {
      elem.classList.remove("decoration-animate");
    }, 600);
  }
}

function update() {
  drawTree();
  drawDecorations();
  updateStatus();
  saveTree();
}

// Health decreases over time if neglected
setInterval(() => {
  treeState.health -= 1;
  if (treeState.health < 0) treeState.health = 0;
  update();
}, 20000); // every 20s

// Load and draw on startup
window.onload = () => {
  loadTree();
  update();
};
