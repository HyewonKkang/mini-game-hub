import { Card } from './Card.js';

const WAIT_MS = 400;
const TIMER = 1000;
const LEVELS = {
    0: { size: 4, timeLimit: 30 },
    1: { size: 6, timeLimit: 90 },
    2: { size: 8, timeLimit: 210 },
};

class GameManager {
    constructor(level = 0) {
        this.attempts = 0;
        this.flipCount = 0;
        this.matchCount = 0;
        this.level = level;
        this.size = LEVELS[this.level].size;
        this.timeLimit = LEVELS[this.level].timeLimit;
        this.timerId = null;
        this.timeLeft = this.timeLimit;
        this.score = 0;
        this.firstCard = null;
        this.secondCard = null;
        this.board = [];
        this.done = false;

        this.boardContainer = document.querySelector('.board');
        this.timerElement = document.querySelector('.timer');
        this.dialogElement = document.querySelector('.dialog');

        this.listen();
        this.init();
    }

    listen() {
        this.dialogElement.querySelector('.play-button').addEventListener('click', () => {
            this.dialogElement.close();
            this.startNewGame();
        });
        document
            .querySelector('.reset-button')
            .addEventListener('click', this.startNewGame.bind(this));
    }

    init() {
        this.clearBoard();
        this.shuffleCards();
        this.buildCards();
        this.startTimer();
    }

    startNewGame() {
        this.stopTimer();
        this.resetGameData();
        this.init();
    }

    resetGameData() {
        this.attempts = 0;
        this.flipCount = 0;
        this.matchCount = 0;
        this.score = 0;
        this.firstCard = null;
        this.secondCard = null;
        this.timerId = null;
        this.timeLeft = this.timeLimit;
    }

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    shuffleCards() {
        const symbols = new Array(32).fill().map((_, index) => index);
        const randomSymbols = this.shuffle(symbols).slice(0, this.size ** 2 / 2);
        this.board = this.shuffle(randomSymbols.concat(randomSymbols));
    }

    clearBoard() {
        this.boardContainer.replaceChildren();
    }

    buildCards() {
        const boardFragment = document.createDocumentFragment();
        this.board.forEach((item, index) => {
            const cardElement = this.buildCardElement(item, index);
            boardFragment.appendChild(cardElement);
            this.board[index] = new Card(item, index);
        });
        this.boardContainer.appendChild(boardFragment);
        this.boardContainer.addEventListener('click', this.turn.bind(this));
    }

    revealCard(cardIndex) {
        const selectedCard = this.boardContainer.querySelector(`#card-${cardIndex}`);
        selectedCard.classList.add('opened');
        this.board[cardIndex].reveal();
    }

    concealCard(cardIndex) {
        const selectedCard = this.boardContainer.querySelector(`#card-${cardIndex}`);
        selectedCard.classList.remove('opened');
        this.board[cardIndex].conceal();
    }

    buildCardElement(item, index) {
        const liElement = document.createElement('li');
        liElement.setAttribute('class', `card card-${this.level}`);
        liElement.setAttribute('id', `card-${index}`);

        const divFrontElement = document.createElement('div');
        divFrontElement.setAttribute('class', 'front');

        const divBackElement = document.createElement('div');
        divBackElement.setAttribute('class', 'back');
        divBackElement.style.backgroundImage = `url(images/icons/${item}.svg)`;

        liElement.appendChild(divFrontElement);
        liElement.appendChild(divBackElement);

        return liElement;
    }

    isCardMatched() {
        return this.board[this.firstCard].value === this.board[this.secondCard].value;
    }

    async pairMatched() {
        this.matchCount += 1;
        this.board[this.firstCard].isMatched = true;
        this.board[this.secondCard].isMatched = true;
        await this.wait(WAIT_MS);
        this.markMatchedPair();
        this.clearTurn();
    }

    markMatchedPair() {
        const firstCard = this.boardContainer.querySelector(`#card-${this.firstCard}`);
        firstCard.classList.add('matched');
        const secondCard = this.boardContainer.querySelector(`#card-${this.secondCard}`);
        secondCard.classList.add('matched');
    }

    wait(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }

    async pairNotMatched() {
        await this.wait(WAIT_MS);
        this.concealCard(this.firstCard);
        this.concealCard(this.secondCard);
        this.clearTurn();
    }

    turn(e) {
        const selectedCard = e.target.parentElement.getAttribute('id');

        if (selectedCard === null) return;

        const selectedCardIndex = selectedCard.split('-')[1];
        const selectedBoardCard = this.board[selectedCardIndex];

        if (selectedBoardCard.isRevealed || selectedBoardCard.isMatched) return;

        if (this.flipCount > 1) return; // 이전 페어 확인 중일 때 발생하는 클릭 무시

        this.revealCard(selectedCardIndex);
        this.flipCount++;

        if (this.flipCount === 1) {
            this.firstCard = selectedCardIndex;
        } else {
            this.secondCard = selectedCardIndex;
            this.attempts++;

            if (this.isCardMatched()) {
                this.pairMatched();
            } else {
                this.pairNotMatched();
            }
        }

        if (this.matchCount === this.size * 2) {
            this.stopTimer();
            this.gameSuccess();
        }
    }

    clearTurn() {
        this.firstCard = undefined;
        this.secondCard = undefined;
        this.flipCount = 0;
    }

    startTimer() {
        this.showNewTime(this.timeLimit);
        this.timerId = setInterval(this.updateTimer.bind(this), TIMER);
    }

    updateTimer() {
        if (this.timeLeft === 0) {
            this.done = true;
            this.stopTimer();
            this.gameOver();
        }

        this.showNewTime(this.timeLeft--);
    }

    showNewTime(time) {
        this.timerElement.innerText = this.makeTimeFormat(time);
    }

    makeTimeFormat(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    stopTimer() {
        if (!this.timerId) return;
        clearInterval(this.timerId);
        this.timerId = null;
    }

    gameSuccess() {
        this.dialogElement.querySelector('h2').textContent = 'You Win!';
        this.dialogElement.querySelector('p').innerHTML = `You won in ${
            this.timeLimit - this.timeLeft
        } seconds, using ${this.attempts} attempts<br />PLAY ANOTHER GAME`;
        this.dialogElement.showModal();
    }

    gameOver() {
        this.dialogElement.querySelector('h2').textContent = 'GAME OVER';
        this.dialogElement.querySelector('p').textContent = 'CLICK TO PLAY AGAIN';
        this.dialogElement.showModal();
    }
}

new GameManager(1);
