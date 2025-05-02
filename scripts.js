const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const startButton = document.querySelector('.start-button');
const restartButton = document.querySelector('.restart-button');
const pauseButton = document.getElementById('pause-button');
const gameOverAudio = document.getElementById('game-over-audio'); 
const toggleSoundButton = document.getElementById('toggle-sound');
const backgroundMusic = document.getElementById('background-music');
const gameOverImage = document.getElementById('game-over-image');
const scoreDisplay = document.getElementById('score');

gameOverAudio.volume = 0.5;

let score = 0;
let isMuted = false;

toggleSoundButton.addEventListener('click', () => {
    isMuted = !isMuted;
    gameOverAudio.muted = isMuted;
    toggleSoundButton.textContent = isMuted ? 'Unmute' : 'Mute';
});

const adjustGameForScreenSize = () => {
    if (window.innerWidth <= 768) { 
        document.documentElement.style.setProperty('--jump-height', '220px'); 
        document.documentElement.style.setProperty('--pipe-speed', '0.9s'); 
    } else {
        document.documentElement.style.setProperty('--jump-height', '180px'); 
        document.documentElement.style.setProperty('--pipe-speed', '1.5s'); 
    }
};

adjustGameForScreenSize();
window.addEventListener('resize', adjustGameForScreenSize);

const adjustFOVForScreenSize = () => {
    const gameBoard = document.querySelector('.game-board');
    const mario = document.querySelector('.mario');
    const pipe = document.querySelector('.pipe');
    const clouds = document.querySelector('.clouds');

    if (window.innerWidth <= 768) { 
        gameBoard.style.height = '400px'; 
        mario.style.width = '120px'; 
        pipe.style.width = '60px'; 
        clouds.style.width = '400px';
    } else { 
        gameBoard.style.height = '500px'; 
        mario.style.width = '150px'; 
        pipe.style.width = '80px'; 
        clouds.style.width = '500px';
    }
};

adjustFOVForScreenSize();
window.addEventListener('resize', adjustFOVForScreenSize);

const jump = () => {
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
};

let gameStarted = false;
let gamePaused = false;

pipe.style.animationPlayState = 'paused';

const loop = setInterval(() => {
    if (!gameStarted || gamePaused) return; 

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 100) {
        pipe.style.animationPlayState = 'paused';
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = './assets/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        gameOverAudio.play();

        gameOverImage.style.display = 'block';
        gameOverImage.style.animation = 'game-over-animation 2s ease-out forwards';

        clearInterval(loop);
    }
        if (pipePosition < 0 && !pipe.classList.contains('scored')) {
            score++; 
            scoreDisplay.textContent = `Score: ${score}`; 
            pipe.classList.add('scored'); 
    
            setTimeout(() => {
                pipe.classList.remove('scored');
            }, 500);
        }
    
}, 10);


startButton.addEventListener('click', (event) => {
    event.stopPropagation();
    gameStarted = true;
    startButton.style.display = 'none';
    restartButton.style.display = 'inline-block';
    pauseButton.style.display = 'inline-block';
    pipe.style.animation = `pipe-animation var(--pipe-speed) infinite linear`; 
    pipe.style.animationPlayState = 'running';
    backgroundMusic.play();
    document.addEventListener('keydown', jump);
});

pauseButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!gamePaused) {
        gamePaused = true;
        pauseButton.textContent = 'Continue';
        pipe.style.animationPlayState = 'paused';
        backgroundMusic.pause();
        document.removeEventListener('keydown', jump);
    } else {
        gamePaused = false;
        pauseButton.textContent = 'Pause';
        pipe.style.animationPlayState = 'running';
        backgroundMusic.play();
        document.addEventListener('keydown', jump);
    }
});

restartButton.addEventListener('click', (event) => {
    event.stopPropagation();
    score = 0;
    scoreDisplay.textContent  = `Score: ${score}`;
    location.reload();
});

document.addEventListener('keydown', (event) => {
    if (gameStarted && !gamePaused) {
        jump();
    }
});

document.addEventListener('touchstart', (event) => {
    if (gameStarted && !gamePaused) {
        jump();
    }
});

document.addEventListener('click', (event) => {
    if (gameStarted && !gamePaused) {
        jump();
    }
});
