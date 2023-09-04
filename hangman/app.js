const wordContainer = document.querySelector('.word-container');
const lettersContainer = document.querySelector('.letters-container');
const restartButton = document.querySelector('.restart-button');
const hangmanParts = document.querySelectorAll('.hangman-part');

window.addEventListener('keydown', handleAlphabetPress);
lettersContainer.addEventListener('click', handleAlphabetClick);
restartButton.addEventListener('click', restartGame);

let selectedWord = null;
let tries = 0;
let gameOver = false;
let gameSuccess = false;

let correctLetters = [];
let wrongLetters = [];

async function generateWord() {
    const res = await fetch('https://random-word-api.vercel.app/api?words=1');
    const data = await res.json();
    if (res.ok) {
        selectedWord = data[0].toUpperCase();
        displayWord();
    } else {
        throw Error(data);
    }
}

function displayWord() {
    wordContainer.innerHTML = selectedWord
        .split('')
        .map(
            (letter) => `
			<span class="letter">${correctLetters.includes(letter) ? letter : ''}</span>
			`,
        )
        .join('');
}

function handleAlphabetPress(e) {
    const keyCode = e.keyCode;
    if (keyCode <= 64 || keyCode >= 91) return;
    const letter = e.key.toUpperCase();
    turn(letter);
}

function handleAlphabetClick(e) {
    const letter = e.target.id;
    if (letter === null || letter === '') return;
    turn(letter);
}

function turn(letter) {
    if (correctLetters.includes(letter) || wrongLetters.includes(letter)) {
        showNotification();
        return;
    }
    if (selectedWord.includes(letter)) {
        markCorrect(letter);
    } else {
        tries++;
        markWrong(letter);
        displayHangman();
    }
    displayWord();
    checkGameCompletion();
}

function markCorrect(letter) {
    correctLetters.push(letter);
    const letterEl = lettersContainer.querySelector(`#${letter}`);
    letterEl.classList.add('correct');
}

function markWrong(letter) {
    wrongLetters.push(letter);
    const letterEl = lettersContainer.querySelector(`#${letter}`);
    letterEl.classList.add('wrong');
}

function checkGameCompletion() {
    if (selectedWord.length === correctLetters.length) {
        gameSuccess = true;
        showNotification();
    }
    if (tries === 10) {
        gameOver = false;
        showNotification();
    }
}

function restartGame() {
    generateWord();
    generateLetters();
    resetGameData();
}

function resetGameData() {
    correctLetters = [];
    wrongLetters = [];
    selectedWord = null;
    tries = 0;
    gameOver = false;
    gameSuccess = false;
}

function displayHangman() {
    hangmanParts.forEach((part, index) => {
        if (index === tries) {
            part.classList.add('visible');
        }
    });
}

function showNotification() {}

function generateLetters() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    lettersContainer.replaceChildren();
    const containerFragment = document.createDocumentFragment();
    for (const letter of letters) {
        const button = document.createElement('button');
        button.setAttribute('id', letter);
        button.textContent = letter;
        containerFragment.appendChild(button);
    }
    lettersContainer.appendChild(containerFragment);
}

(function init() {
    generateWord();
    generateLetters();
})();
