const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let balloons = [];
let score = 0;
let timer = 30;
let isGameOver = false;

class Balloon {
    constructor() {
        this.x = Math.random() * (canvas.width - 50) + 25;
        this.y = canvas.height + Math.random() * 200;
        this.radius = 25;
        this.speed = Math.random() * 3 + 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.y -= this.speed;
        if (this.y < -this.radius) {
            this.y = canvas.height + this.radius;
            this.x = Math.random() * (canvas.width - 50) + 25;
        }
    }
}

function spawnBalloons() {
    for (let i = 0; i < 5; i++) {
        const balloon = new Balloon();
        balloons.push(balloon);
    }
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawTimer() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Time: ${timer}`, canvas.width - 100, 30);
}

function drawGameOver() {
    ctx.font = '40px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 20);
}

function gameLoop() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        balloons.forEach(balloon => {
            balloon.draw();
            balloon.move();
        });

        drawScore();
        drawTimer();
        requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
    }
}

function decreaseTimer() {
    if (!isGameOver) {
        timer--;
        if (timer <= 0) {
            isGameOver = true;
        }
    }
}

canvas.addEventListener('click', function (event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    balloons.forEach((balloon, index) => {
        const distance = Math.sqrt((x - balloon.x) ** 2 + (y - balloon.y) ** 2);

        if (distance < balloon.radius) {
            balloons.splice(index, 1);
            balloons.push(new Balloon());
            score++;
        }
    });
});

canvas.addEventListener('touchstart', function (event) {
    event.preventDefault();
    const x = event.touches[0].clientX - canvas.getBoundingClientRect().left;
    const y = event.touches[0].clientY - canvas.getBoundingClientRect().top;

    balloons.forEach((balloon, index) => {
        const distance = Math.sqrt((x - balloon.x) ** 2 + (y - balloon.y) ** 2);

        if (distance < balloon.radius) {
            balloons.splice(index, 1);
            balloons.push(new Balloon());
            score++;
        }
    });
}, { passive: false });

spawnBalloons();
setInterval(decreaseTimer, 1000);
gameLoop();

