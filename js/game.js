// JavaScript
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Balloon objects
const balloons = [];
// Array of balloon image sources
const balloonImageSources = [
  "assets/balloon1.png",
  "assets/balloon2.png",
  "assets/balloon3.png",
  "assets/balloon4.png",
  "assets/balloon5.png",
  "assets/balloon6.png",
  "assets/balloon7.png",
  "assets/balloon8.png",
  "assets/balloon9.png",
  "assets/balloon10.png",
];
// Image objects
const pumpImage = new Image();
pumpImage.src = "assets/pump.png";
// Pump nozzle position
const pumpNozzle = {
  x: 1300,
  y: canvas.height - 360,
};
// Event listener for pump button
document.addEventListener("mousedown", pumpBalloons);
document.addEventListener("mouseup", releasePump);
// Event listener for bursting the balloons
canvas.addEventListener("click", burstBalloons);
// // Flag to track if pump is clicked
let isPumpClicked = false;
// // Alphabets for balloons
const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// Pump the balloons
function pumpBalloons() {
  balloons.forEach((balloon) => {
    if (!balloon.isFlying) {
      balloon.radius += 1;
    }
  });
}
// Release the pump
function releasePump() {
  balloons.forEach((balloon) => {
    if (!balloon.isFlying) {
      balloon.isFlying = true;
      const angle = Math.random() * Math.PI * 2;
      balloon.velocityX = Math.cos(angle) * 2;
      balloon.velocityY = Math.sin(angle) * 2;
    }
  });
}
// Burst the balloons
function burstBalloons(event) {
  const rect = canvas.getBoundingClientRect();
  const mousePos = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };

  balloons.forEach((balloon, index) => {
    const dx = mousePos.x - balloon.x;
    const dy = mousePos.y - balloon.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= balloon.radius) {
      balloons.splice(index, 1);
    }
  });
}
// Create a new balloon
function createBalloon() {
  const balloonImageSrc =
    balloonImageSources[Math.floor(Math.random() * balloonImageSources.length)];

  const balloon = {
    x: pumpNozzle.x,
    y: pumpNozzle.y,
    radius: 50,
    isFlying: false,
    velocityX: 0,
    velocityY: 0,
    letter: getRandomLetter(), // Get a random letter for the balloon
    image: new Image(),
  };

  balloon.image.src = balloonImageSrc;
  balloons.push(balloon);
}
// Get a random letter
function getRandomLetter() {
  return alphabets[Math.floor(Math.random() * alphabets.length)];
}
// Update game state
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw balloons
  balloons.forEach((balloon) => {
    if (isPumpClicked && !balloon.isFlying) {
      balloon.x = pumpNozzle.x;
      balloon.y = pumpNozzle.y;
    }

    if (balloon.isFlying) {
      balloon.x += balloon.velocityX;
      balloon.y += balloon.velocityY;
    }
    // Draw balloon image
    ctx.drawImage(
      balloon.image,
      balloon.x - balloon.radius,
      balloon.y - balloon.radius,
      balloon.radius * 2,
      balloon.radius * 2
    );
    // Draw letter on balloon
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(balloon.letter, balloon.x, balloon.y + 8);
  });
  // Draw pump image
  ctx.drawImage(pumpImage, 1200 , canvas.height - 500, 400, 400);

  requestAnimationFrame(update);
}
// Start the game
pumpImage.onload = function () {
  for (let i = 0; i < 5; i++) {
    createBalloon();
  }
  update();
};
