const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 32;
const gravity = 0.5;
const jumpPower = -10;
const maxEggs = 20;

let tsolias = {
    x: 50,
    y: 50,
    vx: 0,
    vy: 0,
    width: tileSize,
    height: tileSize,
    onGround: false,
    eggs: 0
};

let eggs = [];
for (let i = 0; i < maxEggs; i++) {
    eggs.push({
        x: Math.random() * (canvas.width - tileSize),
        y: Math.random() * (canvas.height - 100),
        collected: false
    });
}

let acropolis = {
    x: 700,
    y: 500,
    width: 64,
    height: 64
};

let keys = {};

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function update() {
    if (keys["ArrowLeft"]) tsolias.vx = -5;
    else if (keys["ArrowRight"]) tsolias.vx = 5;
    else tsolias.vx = 0;

    if (keys["Space"] && tsolias.onGround) {
        tsolias.vy = jumpPower;
        tsolias.onGround = false;
    }

    tsolias.vy += gravity;
    tsolias.x += tsolias.vx;
    tsolias.y += tsolias.vy;

    if (tsolias.y + tsolias.height >= canvas.height) {
        tsolias.y = canvas.height - tsolias.height;
        tsolias.vy = 0;
        tsolias.onGround = true;
    }

    eggs.forEach(egg => {
        if (!egg.collected && tsolias.x < egg.x + tileSize && tsolias.x + tileSize > egg.x &&
            tsolias.y < egg.y + tileSize && tsolias.y + tileSize > egg.y) {
            egg.collected = true;
            tsolias.eggs++;
        }
    });

    if (tsolias.eggs === maxEggs &&
        tsolias.x < acropolis.x + acropolis.width &&
        tsolias.x + tsolias.width > acropolis.x &&
        tsolias.y < acropolis.y + acropolis.height &&
        tsolias.y + tsolias.height > acropolis.y) {
        alert("You made it to the Acropolis with all the eggs! You win!");
        document.location.reload();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    ctx.fillRect(tsolias.x, tsolias.y, tsolias.width, tsolias.height);

    ctx.fillStyle = "red";
    eggs.forEach(egg => {
        if (!egg.collected) ctx.fillRect(egg.x, egg.y, tileSize, tileSize);
    });

    ctx.fillStyle = "white";
    ctx.fillRect(acropolis.x, acropolis.y, acropolis.width, acropolis.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();