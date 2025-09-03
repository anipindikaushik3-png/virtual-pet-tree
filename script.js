// Beautiful Animated Pet Tree

// Tree structure for animation
const TREE_STRUCTURE = [
  // Each stage: trunk height, branches, leaves
  {
    name: "Seed",
    trunk: 50,
    branches: [],
    leaves: [],
    color: "#936639"
  },
  {
    name: "Sprout",
    trunk: 110,
    branches: [
      { x1: 200, y1: 450, x2: 170, y2: 370 }
    ],
    leaves: [
      { x: 170, y: 360 }
    ],
    color: "#a98467"
  },
  {
    name: "Sapling",
    trunk: 160,
    branches: [
      { x1: 200, y1: 450, x2: 170, y2: 370 },
      { x1: 200, y1: 450, x2: 230, y2: 340 }
    ],
    leaves: [
      { x: 170, y: 360 },
      { x: 230, y: 330 },
      { x: 200, y: 320 }
    ],
    color: "#a98467"
  },
  {
    name: "Young Tree",
    trunk: 210,
    branches: [
      { x1: 200, y1: 450, x2: 170, y2: 370 },
      { x1: 200, y1: 450, x2: 230, y2: 340 },
      { x1: 200, y1: 450, x2: 150, y2: 300 }
    ],
    leaves: [
      { x: 170, y: 360 },
      { x: 230, y: 330 },
      { x: 200, y: 320 },
      { x: 150, y: 290 },
      { x: 210, y: 290 }
    ],
    color: "#a98467"
  },
  {
    name: "Full Tree",
    trunk: 260,
    branches: [
      { x1: 200, y1: 450, x2: 170, y2: 370 },
      { x1: 200, y1: 450, x2: 230, y2: 340 },
      { x1: 200, y1: 450, x2: 150, y2: 300 },
      { x1: 200, y1: 450, x2: 250, y2: 290 }
    ],
    leaves: [
      { x: 170, y: 360 },
      { x: 230, y: 330 },
      { x: 200, y: 320 },
      { x: 150, y: 290 },
      { x: 210, y: 290 },
      { x: 250, y: 280 },
      { x: 180, y: 260 },
      { x: 220, y: 250 }
    ],
    color: "#a98467"
  }
];

let treeState = {
  stage: 0,      // 0 = seed, ... 4 = full tree
  health: 10,    // 0-10
  decorations: [],
  lastAction: "",
};

function drawTreeAnimated() {
  const svg = document.getElementById("tree-svg");
  svg.innerHTML = "";

  let stage = TREE_STRUCTURE[treeState.stage];
  // Animate trunk
  let trunkProgress = 0;
  let trunkTarget = stage.trunk;
  function animateTrunk() {
    trunkProgress += 10;
    if (trunkProgress > trunkTarget) trunkProgress = trunkTarget;
    svg.innerHTML = `
      <rect x="190" y="${450-trunkProgress}" width="20" height="${trunkProgress}" rx="10" fill="${stage.color}" />
    `;
    if (trunkProgress < trunkTarget) {
      requestAnimationFrame(animateTrunk);
    } else {
      animateBranches();
    }
  }

  let branchProgress = 0;
  function animateBranches() {
    if (!stage.branches.length) {
      animateLeaves();
      return;
    }
    branchProgress = 0;
    let branchIdx = 0;
    function growBranch() {
      if (branchIdx >= stage.branches.length) {
        animateLeaves();
        return;
      }
      let b = stage.branches[branchIdx];
      let length = Math.hypot(b.x2-b.x1, b.y2-b.y1);
      branchProgress += 12;
      if (branchProgress > length) branchProgress = length;
      let ratio = branchProgress/length;
      let bx = b.x1 + (b.x2-b.x1)*ratio;
      let by = b.y1 + (b.y2-b.y1)*ratio;
      // Draw all finished branches
      svg.innerHTML = `
        <rect x="190" y="${450-stage.trunk}" width="20" height="${stage.trunk}" rx="10" fill="${stage.color}"/>
      `;
      for (let i = 0; i < branchIdx; ++i) {
        let bb = stage.branches[i];
        svg.innerHTML += `
          <line x1="${bb.x1}" y1="${bb.y1}" x2="${bb.x2}" y2="${bb.y2}" stroke="#7c4700" stroke-width="10" stroke-linecap="round"/>
        `;
      }
      // Draw growing branch
      svg.innerHTML += `
        <line x1="${b.x1}" y1="${b.y1}" x2="${bx}" y2="${by}" stroke="#7c4700" stroke-width="10" stroke-linecap="round"/>
      `;
      if (branchProgress < length) {
        requestAnimationFrame(growBranch);
      } else {
        branchProgress = 0;
        branchIdx++;
        requestAnimationFrame(growBranch);
      }
    }
    growBranch();
  }

  let leafIdx = 0;
  function animateLeaves() {
    if (!stage.leaves.length) {
      drawDecorations();
      return;
    }
    svg.innerHTML = `
      <rect x="190" y="${450-stage.trunk}" width="20" height="${stage.trunk}" rx="10" fill="${stage.color}"/>
    `;
    for (let b of stage.branches) {
      svg.innerHTML += `
        <line x1="${b.x1}" y1="${b.y1}" x2="${b.x2}" y2="${b.y2}" stroke="#7c4700" stroke-width="10" stroke-linecap="round"/>
      `;
    }
    function growLeaf() {
      if (leafIdx >= stage.leaves.length) {
        drawDecorations();
        return;
      }
      let l = stage.leaves[leafIdx];
      // Draw all finished leaves
      for (let i = 0; i < leafIdx; ++i) {
        let ll = stage.leaves[i];
        svg.innerHTML += `<ellipse class="leaf" cx="${ll.x}" cy="${ll.y}" rx="18" ry="10" fill="#38b000" stroke="#168000" stroke-width="3"/>`;
      }
      // Animate popping in new leaf
      let scale = 0;
      function popLeaf() {
        scale += 0.14;
        if (scale > 1) scale = 1;
        svg.innerHTML = `
          <rect x="190" y="${450-stage.trunk}" width="20" height="${stage.trunk}" rx="10" fill="${stage.color}"/>
        `;
        for (let b of stage.branches) {
          svg.innerHTML += `
            <line x1="${b.x1}" y1="${b.y1}" x2="${b.x2}" y2="${b.y2}" stroke="#7c4700" stroke-width="10" stroke-linecap="round"/>
          `;
        }
        for (let i = 0; i < leafIdx; ++i) {
          let ll = stage.leaves[i];
          svg.innerHTML += `<ellipse class="leaf" cx="${ll.x}" cy="${ll.y}" rx="18" ry="10" fill="#38b000" stroke="#168000" stroke-width="3"/>`;
        }
        svg.innerHTML += `<ellipse class="leaf" cx="${l.x}" cy="${l.y}" rx="${18*scale}" ry="${10*scale}" fill="#38b000" stroke="#168000" stroke-width="3" style="opacity:${scale}"/>`;
        if (scale < 1) {
          requestAnimationFrame(popLeaf);
        } else {
          leafIdx++;
          requestAnimationFrame(growLeaf);
        }
      }
      popLeaf();
    }
    growLeaf();
  }
  animateTrunk();
}

function updateStatus() {
  document.getElementById("growth-status").textContent =
    `Growth: ${TREE_STRUCTURE[treeState.stage].name}`;
  document.getElementById("health-status").textContent =
    `Health: ${treeState.health>=7?'😊':treeState.health>=4?'😐':'😢'}`;
  document.getElementById("last-action").textContent = treeState.lastAction;
}

function saveTree() {
  localStorage.setItem("animatedPetTree", JSON.stringify(treeState));
}
function loadTree() {
  const saved = localStorage.getItem("animatedPetTree");
  if (saved) treeState = JSON.parse(saved);
}

function waterTree() {
  treeState.health = Math.min(treeState.health+2, 10);
  treeState.lastAction = "You watered the tree!";
  showWaterDrop();
  setTimeout(() => {
    progressTree();
    update();
  }, 1100);
}
function fertilizeTree() {
  treeState.health = Math.min(treeState.health+1, 10);
  treeState.lastAction = "You fertilized the tree!";
  showSparkle();
  setTimeout(() => {
    progressTree(true);
    update();
  }, 1000);
}

function progressTree(fertilize=false) {
  // More chance to grow if fertilized
  if (treeState.health >= 5) {
    const chance = fertilize ? 0.7 : 0.4;
    if (Math.random() < chance && treeState.stage < TREE_STRUCTURE.length-1) {
      treeState.stage++;
      treeState.lastAction += " 🌱 It grew!";
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
    {emoji: "🌸", x: 220, y: 320},
    {emoji: "🦋", x: 160, y: 270},
    {emoji: "🎈", x: 245, y: 250},
    {emoji: "🍎", x: 170, y: 220},
    {emoji: "🧚", x: 210, y: 195}
  ];
  const deco = {...decoTypes[Math.floor(Math.random()*decoTypes.length)], animate:true};
  treeState.decorations.push(deco);
  treeState.lastAction = `You added a ${deco.emoji}!`;
  update();
  animateDecoration(treeState.decorations.length-1);
}

function drawDecorations() {
  // Draw decorations on overlay
  const overlay = document.getElementById("ui-overlay");
  overlay.innerHTML = "";
  treeState.decorations.forEach((deco, idx) => {
    const elem = document.createElement("span");
    elem.textContent = deco.emoji;
    elem.style.position = "absolute";
    elem.style.left = deco.x + "px";
    elem.style.top = deco.y + "px";
    elem.style.fontSize = "2.2rem";
    elem.style.pointerEvents = "none";
    if (deco.animate) {
      elem.classList.add("decoration-animate");
      setTimeout(() => { elem.classList.remove("decoration-animate"); deco.animate = false; }, 700);
    }
    overlay.appendChild(elem);
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
  const overlay = document.getElementById("ui-overlay");
  const drop = document.createElement("span");
  drop.textContent = "💧";
  drop.className = "ui-water";
  overlay.appendChild(drop);
  setTimeout(() => { overlay.removeChild(drop); }, 1200);
}

// Sparkle animation
function showSparkle() {
  const overlay = document.getElementById("ui-overlay");
  const sparkle = document.createElement("span");
  sparkle.textContent = "✨";
  sparkle.className = "ui-sparkle";
  overlay.appendChild(sparkle);
  setTimeout(() => { overlay.removeChild(sparkle); }, 1100);
}

// Decoration pop animation
function animateDecoration(idx) {
  const overlay = document.getElementById("ui-overlay");
  const elem = overlay.children[idx];
  if (elem) {
    elem.classList.add("decoration-animate");
    setTimeout(() => {
      elem.classList.remove("decoration-animate");
    }, 700);
  }
}

function update() {
  drawTreeAnimated();
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
