// MAXIMUM CUTE Virtual Pet Tree

const TREE_STRUCTURE = [
  {
    name: "Seed",
    trunk: 45,
    branches: [],
    leaves: [],
    color: "#F9D29D"
  },
  {
    name: "Sprout",
    trunk: 110,
    branches: [
      { x1: 200, y1: 450, x2: 170, y2: 370, c1x: 190, c1y: 430, c2x: 175, c2y: 400 }
    ],
    leaves: [
      { x: 170, y: 355, angle: -25, size: 1.2, color: "#FFDFE7" }
    ],
    color: "#F7B787"
  },
  {
    name: "Sapling",
    trunk: 160,
    branches: [
      { x1: 200, y1: 450, x2: 170, y2: 370, c1x: 190, c1y: 430, c2x: 175, c2y: 400 },
      { x1: 200, y1: 450, x2: 230, y2: 340, c1x: 210, c1y: 410, c2x: 225, c2y: 370 }
    ],
    leaves: [
      { x: 170, y: 355, angle: -25, size: 1.2, color: "#FFDFE7" },
      { x: 230, y: 335, angle: 35, size: 1.1, color: "#B8F3FF" },
      { x: 200, y: 320, angle: 0, size: 1, color: "#FFE6CA" }
    ],
    color: "#F7B787"
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
      { x: 170, y: 355, angle: -25, size: 1.2, color: "#FFDFE7" },
      { x: 230, y: 335, angle: 35, size: 1.1, color: "#B8F3FF" },
      { x: 200, y: 320, angle: 0, size: 1, color: "#FFE6CA" },
      { x: 150, y: 295, angle: -40, size: 1.2, color: "#D6FFDE" },
      { x: 210, y: 290, angle: 10, size: 1.1, color: "#E1DFFF" }
    ],
    color: "#F7B787"
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
      { x: 170, y: 355, angle: -25, size: 1.3, color: "#FFDFE7" },
      { x: 230, y: 335, angle: 35, size: 1.2, color: "#B8F3FF" },
      { x: 200, y: 320, angle: 0, size: 1.1, color: "#FFE6CA" },
      { x: 150, y: 295, angle: -40, size: 1.3, color: "#D6FFDE" },
      { x: 210, y: 290, angle: 10, size: 1.2, color: "#E1DFFF" },
      { x: 250, y: 285, angle: 42, size: 1.2, color: "#F7CAF7" },
      { x: 180, y: 260, angle: -18, size: 1.1, color: "#B8F3FF" },
      { x: 220, y: 250, angle: 15, size: 1.1, color: "#FFF1B5" }
    ],
    color: "#F7B787"
  }
];

const FACE = {
  eyes: [
    { x: 194, y: 450, r: 7, blink: false },
    { x: 208, y: 450, r: 7, blink: false }
  ],
  smile: {
    cx: 201, cy: 460, rx: 14, ry: 7
  },
  blush: [
    { cx: 187, cy: 460, rx: 6, ry: 2.2 },
    { cx: 215, cy: 460, rx: 6, ry: 2.2 }
  ]
};

let treeState = {
  stage: 0,
  health: 10,
  decorations: [],
  lastAction: "",
  bounce: false,
  blink: false,
  faceMood: "smile" // "smile" "wink" "sad"
};

function drawTreeAnimated() {
  const svg = document.getElementById("tree-svg");
  svg.innerHTML = drawBackground();
  let stage = TREE_STRUCTURE[treeState.stage];

  // Animate trunk
  let trunkProgress = 0;
  let trunkTarget = stage.trunk;
  let bounce = treeState.bounce ? 1 : 0;
  treeState.bounce = false;

  function animateTrunk() {
    trunkProgress += 10;
    if (trunkProgress > trunkTarget) trunkProgress = trunkTarget;
    let trunkY = 450 - trunkProgress + (bounce ? Math.sin(trunkProgress/30)*16 : 0);

    svg.innerHTML = drawBackground() + `
      <ellipse cx="200" cy="${trunkY + trunkProgress/2}" rx="32" ry="${trunkProgress/2}" fill="${stage.color}" />
      <rect x="180" y="${trunkY}" width="40" height="${trunkProgress}" rx="20" fill="${stage.color}" />
      ${drawFace(trunkY + trunkProgress)}
    `;
    if (trunkProgress < trunkTarget) {
      requestAnimationFrame(animateTrunk);
    } else {
      animateBranches();
    }
  }

  function bezierPath(b, pct) {
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
    svg.innerHTML = drawBackground() + `
      <ellipse cx="200" cy="${450-stage.trunk/2}" rx="32" ry="${stage.trunk/2}" fill="${stage.color}" />
      <rect x="180" y="${450-stage.trunk}" width="40" height="${stage.trunk}" rx="20" fill="${stage.color}" />
      ${drawFace(450)}
    `;
    for (let i = 0; i < branchIdx; ++i) {
      let b = stage.branches[i];
      svg.innerHTML += `<path d="M${b.x1},${b.y1} C${b.c1x},${b.c1y} ${b.c2x},${b.c2y} ${b.x2},${b.y2}"
        stroke="#F9D29D" stroke-width="11" fill="none" stroke-linecap="round"/>`;
    }
    if (branchIdx < stage.branches.length) {
      let b = stage.branches[branchIdx];
      branchPct += 0.09;
      if (branchPct > 1) branchPct = 1;
      svg.innerHTML += `<path d="${bezierPath(b, branchPct)}"
        stroke="#F9D29D" stroke-width="11" fill="none" stroke-linecap="round"/>`;
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
    svg.innerHTML = drawBackground() + `
      <ellipse cx="200" cy="${450-stage.trunk/2}" rx="32" ry="${stage.trunk/2}" fill="${stage.color}" />
      <rect x="180" y="${450-stage.trunk}" width="40" height="${stage.trunk}" rx="20" fill="${stage.color}" />
      ${drawFace(450)}
    `;
    for (let b of stage.branches) {
      svg.innerHTML += `<path d="M${b.x1},${b.y1} C${b.c1x},${b.c1y} ${b.c2x},${b.c2y} ${b.x2},${b.y2}"
        stroke="#F9D29D" stroke-width="11" fill="none" stroke-linecap="round"/>`;
    }
    for (let i = 0; i < leafIdx; ++i) {
      let l = stage.leaves[i];
      svg.innerHTML += drawCuteLeaf(l.x, l.y, l.angle, l.size, l.color, 1, i);
    }
    if (leafIdx < stage.leaves.length) {
      let l = stage.leaves[leafIdx];
      let scale = 0;
      function popLeaf() {
        scale += 0.13;
        if (scale > 1) scale = 1;
        svg.innerHTML = drawBackground() + `
          <ellipse cx="200" cy="${450-stage.trunk/2}" rx="32" ry="${stage.trunk/2}" fill="${stage.color}" />
          <rect x="180" y="${450-stage.trunk}" width="40" height="${stage.trunk}" rx="20" fill="${stage.color}" />
          ${drawFace(450)}
        `;
        for (let b of stage.branches) {
          svg.innerHTML += `<path d="M${b.x1},${b.y1} C${b.c1x},${b.c1y} ${b.c2x},${b.c2y} ${b.x2},${b.y2}"
            stroke="#F9D29D" stroke-width="11" fill="none" stroke-linecap="round"/>`;
        }
        for (let i = 0; i < leafIdx; ++i) {
          let ll = stage.leaves[i];
          svg.innerHTML += drawCuteLeaf(ll.x, ll.y, ll.angle, ll.size, ll.color, 1, i);
        }
        svg.innerHTML += drawCuteLeaf(l.x, l.y, l.angle, l.size, l.color, scale, leafIdx);
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

  function drawFace(baseY) {
    // Changes with treeState.faceMood
    let cheekColor = "#FFB6B6";
    let {eyes, smile, blush} = FACE;
    let mood = treeState.faceMood;
    let wink = treeState.blink;
    let leftEye = wink ? `<ellipse cx="${eyes[0].x}" cy="${baseY-18}" rx="7" ry="2" fill="#444"/>`
                       : `<circle cx="${eyes[0].x}" cy="${baseY-18}" r="${eyes[0].r}" fill="#444"/>`;
    let rightEye = `<circle cx="${eyes[1].x}" cy="${baseY-18}" r="${eyes[1].r}" fill="#444"/>`;
    let cheeks = `
      <ellipse cx="${blush[0].cx}" cy="${baseY-6}" rx="${blush[0].rx}" ry="${blush[0].ry}" fill="${cheekColor}" opacity="0.6"/>
      <ellipse cx="${blush[1].cx}" cy="${baseY-6}" rx="${blush[1].rx}" ry="${blush[1].ry}" fill="${cheekColor}" opacity="0.6"/>
    `;
    let mouth = mood === "sad"
      ? `<ellipse cx="${smile.cx}" cy="${baseY-3}" rx="${smile.rx}" ry="4" fill="none" stroke="#444" stroke-width="3" transform="rotate(180,${smile.cx},${baseY-3})"/>`
      : `<ellipse cx="${smile.cx}" cy="${baseY+10}" rx="${smile.rx}" ry="7" fill="none" stroke="#444" stroke-width="3"/>`;
    return leftEye + rightEye + cheeks + mouth;
  }

  function drawCuteLeaf(x, y, angle, size, color, scale, idx) {
    // Leaf: rounded, pastel, with sparkle or heart sometimes
    const sparkle = (idx % 3 === 0 && scale === 1)
      ? `<circle cx="${x}" cy="${y-15*size}" r="2.5" fill="#fff" opacity="0.7"/><circle cx="${x+3}" cy="${y-17*size}" r="1.1" fill="#fff" opacity="0.4"/>`
      : "";
    const heart = (idx % 4 === 1 && scale === 1)
      ? `<path d="M ${x-3} ${y-15*size}
         Q ${x} ${y-21*size}, ${x+3} ${y-15*size}
         Q ${x+8} ${y-7*size}, ${x} ${y-4*size}
         Q ${x-8} ${y-7*size}, ${x-3} ${y-15*size} Z"
         fill="#FFB6B6" opacity="0.6"/>` : "";
    let path =
      `M ${x} ${y}
      Q ${x-9*size*scale} ${y-11*size*scale}, ${x} ${y-32*size*scale}
      Q ${x+9*size*scale} ${y-11*size*scale}, ${x} ${y}
      Z`;
    return `<g transform="rotate(${angle},${x},${y})">
      <path class="leaf" d="${path}" fill="${color}" stroke="#fff" stroke-width="2"/>
      ${sparkle}${heart}
    </g>`;
  }

  function drawBackground() {
    // Pastel sky, clouds, grass
    return `
      <rect x="0" y="0" width="400" height="500" fill="url(#skyGradient)"/>
      <defs>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FFF1FB"/>
          <stop offset="90%" stop-color="#B6F4F4"/>
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="490" rx="140" ry="30" fill="#B4F8C8" opacity="0.7"/>
      <ellipse cx="80" cy="80" rx="30" ry="12" fill="#fff" opacity="0.7"/>
      <ellipse cx="320" cy="60" rx="27" ry="14" fill="#fff" opacity="0.55"/>
      <ellipse cx="140" cy="60" rx="18" ry="7" fill="#fff" opacity="0.5"/>
    `;
  }

  animateTrunk();
}


function updateStatus() {
  let mood = "smile";
  if (treeState.health <= 3) mood = "sad";
  if (treeState.health <= 7 && Math.random() < 0.2) {
    treeState.blink = true;
    setTimeout(() => { treeState.blink = false; update(); }, 800);
    mood = "wink";
  }
  treeState.faceMood = mood;
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
      treeState.bounce = true;
      treeState.lastAction += " 🌱 The tree bounced and grew!";
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
    {emoji: "💖", x: 220, y: 320},
    {emoji: "✨", x: 160, y: 270},
    {emoji: "🎀", x: 245, y: 250},
    {emoji: "💎", x: 170, y: 220},
    {emoji: "⭐", x: 210, y: 195},
    {emoji: "🌈", x: 185, y: 190},
    {emoji: "🧸", x: 200, y: 230}
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
    elem.style.fontSize = "2.5rem";
    elem.style.pointerEvents = "none";
    elem.style.transition = "transform 0.6s cubic-bezier(.34,1.56,.64,1)";
    if (deco.animate) {
      elem.style.transform = "translateY(-50px) scale(0.4)";
      setTimeout(() => {
        elem.style.transform = "translateY(0px) scale(1)";
        setTimeout(() => { deco.animate = false; }, 700);
      }, 80);
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
    bounce: false,
    blink: false,
    faceMood: "smile"
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
  drawDecorations();
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
