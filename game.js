// Inisialisasi canvas
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Variabel game
let score = 0;
const requiredScore = 5;
let gameWon = false;

// Player
const player = {
    x: 50,
    y: 300,
    width: 40,
    height: 60,
    speed: 5,
    velocityY: 0,
    jumping: false,
    color: '#ff69b4'
};

// Platform
const platforms = [
    { x: 0, y: 360, width: 200, height: 20, color: '#4CAF50' },
    { x: 250, y: 300, width: 200, height: 20, color: '#4CAF50' },
    { x: 500, y: 250, width: 200, height: 20, color: '#4CAF50' },
    { x: 0, y: 360, width: 800, height: 40, color: '#795548' } // Ground
];

// Koin
const coins = [
    { x: 100, y: 320, width: 20, height: 20, collected: false },
    { x: 300, y: 260, width: 20, height: 20, collected: false },
    { x: 350, y: 260, width: 20, height: 20, collected: false },
    { x: 550, y: 210, width: 20, height: 20, collected: false },
    { x: 600, y: 210, width: 20, height: 20, collected: false }
];

// Hadiah
const cake = {
    x: 700,
    y: 200,
    width: 60,
    height: 60,
    visible: false
};

// Kontrol
const keys = {
    right: false,
    left: false,
    up: false
};

// Event listeners
window.addEventListener('keydown', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'Left' || e.key === 'ArrowLeft') keys.left = true;
    if ((e.key === 'Up' || e.key === 'ArrowUp' || e.key === ' ') && !player.jumping) {
        player.jumping = true;
        player.velocityY = -15;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'Left' || e.key === 'ArrowLeft') keys.left = false;
});

// Fungsi update game
function update() {
    // Gerakan player
    if (keys.right) player.x += player.speed;
    if (keys.left) player.x -= player.speed;
    
    // Gravitasi
    player.velocityY += 0.8;
    player.y += player.velocityY;
    
    // Batas layar
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    
    // Deteksi platform
    player.jumping = true;
    platforms.forEach(platform => {
        if (
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height + player.velocityY
        ) {
            player.jumping = false;
            player.velocityY = 0;
            player.y = platform.y - player.height;
        }
    });
    
    // Deteksi koin
    coins.forEach(coin => {
        if (
            !coin.collected &&
            player.x + player.width > coin.x &&
            player.x < coin.x + coin.width &&
            player.y + player.height > coin.y &&
            player.y < coin.y + coin.height
        ) {
            coin.collected = true;
            score++;
            document.getElementById('score').textContent = `Koin: ${score}`;
            
            if (score >= requiredScore) {
                cake.visible = true;
            }
        }
    });
    
    // Deteksi kue
    if (
        cake.visible &&
        player.x + player.width > cake.x &&
        player.x < cake.x + cake.width &&
        player.y + player.height > cake.y &&
        player.y < cake.y + cake.height
    ) {
        gameWon = true;
        document.getElementById('message').textContent = 'SELAMAT ULANG TAHUN! [Nama Temanmu]';
    }
}

// Fungsi draw
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw platforms
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
    
    // Draw coins
    coins.forEach(coin => {
        if (!coin.collected) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // Draw cake if visible
    if (cake.visible) {
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(cake.x, cake.y, cake.width, cake.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(cake.x + 10, cake.y + 10, cake.width - 20, 10);
    }
    
    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x + 10, player.y + 15, 8, 8);
    ctx.fillRect(player.x + 25, player.y + 15, 8, 8);
    
    // Draw mouth
    ctx.fillStyle = 'black';
    ctx.fillRect(player.x + 15, player.y + 30, 15, 5);
}

// Game loop
function gameLoop() {
    update();
    draw();
    
    if (!gameWon) {
        requestAnimationFrame(gameLoop);
    }
}

// Mulai game
gameLoop();
