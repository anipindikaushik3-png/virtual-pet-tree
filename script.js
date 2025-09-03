// Improved Animated Pet Tree with Curved Branches and Nicer Leaves

const TREE_STRUCTURE = [
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
      { x1: 200, y1: 450, x2: 170, y2: 370, c1x: 190, c1y: 430, c2x: 175, c2y: 400 }
    ],
    leaves: [
      { x: 170, y: 355, angle: -25 }
    ],
    color: "#9c6f3c"
  },
  {
    name: "Sapling",
    trunk: 160,
    branches: [
      { x1: 200, y1: 450, x2: 170, y2: 370, c1x: 190, c1y: 430, c2x: 175, c2y: 400 },
      { x1: 200, y1: 450, x2: 230, y2: 340, c1x: 210, c1y: 410, c2x: 225, c2y: 370 }
    ],
    leaves: [
      { x: 170, y: 355, angle: -25 },
      { x: 230, y: 335, angle: 35 },
      { x: 200, y: 320, angle: 0 }
    ],
    color: "#a98467"
  },
  {
    name: "Young Tree",
    trunk: 210,
    branches: [
      { x1: 200, y1: 450, x2: 170, y2: 370, c1x: 190, c1y: 430, c2x: 175, c2y: 400 },
      { x1: 200, y1: 450, x2: 230, y2: 340, c1x: 210, c1y: 410, c2x: 225, c2y: 370 },
      { x1: 200, y1: 410, x2: 150, y2: 300, c1x: 180, c1y: 380, c2x: 155, c2y: 340 }
    ],
    leaves: [
      { x: 170, y: 355, angle: -25 },
      { x: 230, y: 335, angle: 35 },
      { x: 200, y: 320, angle: 0 },
      { x: 150, y: 295, angle: -40 },
      { x: 210, y: 290, angle: 10 }
    ],
    color: "#a98467"
  },
  {
    name: "Full Tree",
    trunk: 260,
    branches: [
      { x1: 200, y1: 450, x2: 170, y2: 370, c1x: 190, c1y: 430, c2x: 175, c2y: 400 },
      { x1: 200, y1: 450, x2: 230, y2: 340, c1x: 210, c1y: 410, c2x: 225, c2y: 370 },
      { x1: 200, y1: 410, x2: 150, y2: 300, c1x: 180, c1y: 380, c2x: 155, c2y: 340 },
      { x1: 200, y1: 410, x2: 250, y2: 290, c1x: 220, c1y: 370, c2x: 245, c2y: 340 }
    ],
    leaves: [
      { x: 170, y: 355, angle: -25 },
      { x: 230, y: 335, angle: 35 },
      { x: 200, y: 320, angle: 0 },
      { x: 150, y: 295, angle: -40 },
      { x: 210, y: 290, angle: 10 },
      { x: 250, y: 285, angle: 42 },
      { x: 180, y: 260, angle: -18 },
      { x: 220, y: 250, angle: 15 }
    ],
    color: "#a98467"
  }
];

let treeState = {
  stage: 0,
  health: 10,
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
    svg.innerHTML = `<rect x="190" y="${450-trunkProgress}" width="20" height="${trunkProgress}" rx="10" fill="${stage.color}" />`;
    if (trunkProgress < trunkTarget) {
      requestAnimationFrame(animateTrunk);
    } else {
      animateBranches();
    }
  }

  function bezierPath(b, pct) {
    // Draw up to a percentage of the curve
    const t = pct;
    const x = (1-t)**3 * b.x1 +
              3*(1-t)**2*t * b.c1x +
              3*(1-t)*t**2 * b.c2x +
              t**3 * b.x2;
    const y = (1-t)**3 * b.y1 +
              3*(1-t)**2*t * b.c1y +
              3*(1-t)*t**2 * b.c2y +
              t**3 * b.y2;
    return `M${b.x1},${b.y1} C${b.c1x},${b.c1y} ${b.c2x},${b.c2y} ${x},${y}`;
  }

  let branchIdx = 0, branchPct = 0;
  function animateBranches() {
    if (!stage.branches.length) {
      animateLeaves();
      return;
    }
    svg.innerHTML = `<rect x="190" y="${450-stage.trunk}" width="20" height="${stage.trunk}" rx="10" fill="${stage.color}"/>`;
    for (let i = 0; i < branchIdx; ++i) {
      let b = stage.branches[i];
      svg.innerHTML += `<path d="M${b.x1},${b.y1} C${b.c1x},${b.c1y} ${b.c2x},${b.c2y} ${b.x2},${b.y2}" stroke="#7c4700" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    }
    if (branchIdx < stage.branches.length) {
      let b = stage.branches[branchIdx];
      branchPct += 0.08;
      if (branchPct > 1) branchPct = 1;
      svg.innerHTML += `<path d="${bezierPath(b, branchPct)}" stroke="#7c4700" stroke-width="10" fill="none" stroke-linecap="round"/>`;
      if (branchPct < 1) {
        requestAnimationFrame(animateBranches);
      } else {
        branchIdx++;
        branchPct = 0;
        requestAnimationFrame(animateBranches);
      }
    } else {
      animateLeaves();
    }
  }

  let leafIdx = 0;
  function animateLeaves() {
    svg.innerHTML = `<rect x="190" y="${450-stage.trunk}" width="20" height="${stage.trunk}" rx="10" fill="${stage.color}"/>`;
    for (let b of stage.branches) {
      svg.innerHTML += `<path d="M${b.x1},${b.y1} C${b.c1x},${b.c1y} ${b.c2x},${b.c2y} ${b.x2},${b.y2}" stroke="#7c4700" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    }
    for (let i = 0; i < leafIdx; ++i) {
      let l = stage.leaves[i];
      svg.innerHTML += drawLeaf(l.x, l.y, l.angle, 1);
    }
    if (leafIdx < stage.leaves.length) {
      let l = stage.leaves[leafIdx];
      let scale = 0;
      function popLeaf() {
        scale += 0.13;
        if (scale > 1) scale = 1;
        svg.innerHTML = `<rect x="190" y="${450-stage.trunk}" width="20" height="${stage.trunk}" rx="10" fill="${stage.color}"/>`;
        for (let b of stage.branches) {
          svg.innerHTML += `<path d="M${b.x1},${b.y1} C${b.c1x},${b.c1y} ${b.c2x},${b.c2y} ${b.x2},${b.y2}" stroke="#7c4700" stroke-width="10" fill="none" stroke-linecap="round"/>`;
        }
        for (let i = 0; i < leafIdx; ++i) {
          let ll = stage.leaves[i];
          svg.innerHTML += drawLeaf(ll.x, ll.y, ll.angle, 1);
        }
        svg.innerHTML += drawLeaf(l.x, l.y, l.angle, scale);
        if (scale < 1) {
          requestAnimationFrame(popLeaf);
        } else {
          leafIdx++;
          requestAnimationFrame(animateLeaves);
        }
      }
      popLeaf();
    } else {
      drawDecorations();
    }
  }

  function drawLeaf(x, y, angle, scale) {
    // Draw a rotated, scaled leaf path
    const colorList = ["#3bbf4c", "#4dd36d", "#60e578", "#43a047"];
    const fill = colorList[Math.floor(Math.random()*colorList.length)];
    const leafPath = `
      M ${x} ${y}
      Q ${x-10*scale} ${y-8*scale}, ${x} ${y-30*scale}
      Q ${x+10*scale} ${y-8*scale}, ${x} ${y}
      Z
    `;
    return `<path class="leaf" d="${leafPath}" fill="${fill}" stroke="#168000" stroke-width="2"
      transform="rotate(${angle},${x},${y})"/>`;
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

function showWaterDrop() {
  const overlay = document.getElementById("ui-overlay");
  const drop = document.createElement("span");
  drop.textContent = "💧";
  drop.className = "ui-water";
  overlay.appendChild(drop);
  setTimeout(() => { overlay.removeChild(drop); }, 1200);
}

function showSparkle() {
  const overlay = document.getElementById("ui-overlay");
  const sparkle = document.createElement("span");
  sparkle.textContent = "✨";
  sparkle.className = "ui-sparkle";
  overlay.appendChild(sparkle);
  setTimeout(() => { overlay.removeChild(sparkle); }, 1100);
}

function animateDecoration(idx) {
  const overlay = document.getElementById("ui-overlay");
  const elem = overlay.children[idx];
  if (elem) {
    elem.classList.add("decoration-animate");
    setTimeout(() => { elem.classList.remove("decoration-animate"); }, 700);
  }
}

function update() {
  drawTreeAnimated();
  updateStatus();
  saveTree();
}

setInterval(() => {
  treeState.health -= 1;
  if (treeState.health < 0) treeState.health = 0;
  update();
}, 20000);

window.onload = () => {
  loadTree();
  update();
};
