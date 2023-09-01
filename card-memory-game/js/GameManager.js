import { View } from './View.js';

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

        this.view = new View();

        this.view.listen(
            this.startNewGame.bind(this),
            this.gameStart.bind(this),
            this.handleLevelChanged.bind(this),
            this.turn.bind(this),
        );

        this.init();
        this.gameStart();
    }

    init() {
        this.changeLevel();
        this.view.clearBoard();
        this.shuffleCards();
        this.buildCards();
    }

    startNewGame() {
        this.stopTimer();
        this.resetGameData();
        this.init();
        this.startTimer();
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
        this.view.updateAttemptsCount(0);
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

    buildCards() {
        this.board = this.view.createCards(this.board, this.level);
    }

    revealCard(cardIndex) {
        this.view.markCardAsOpened(cardIndex);
        this.board[cardIndex].reveal();
    }

    concealCard(cardIndex) {
        this.view.markCardAsConcealed(cardIndex);
        this.board[cardIndex].conceal();
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
        this.view.markCardAsMatched(this.firstCard);
        this.view.markCardAsMatched(this.secondCard);
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
            this.view.updateAttemptsCount(++this.attempts);

            if (this.isCardMatched()) {
                this.pairMatched();
            } else {
                this.pairNotMatched();
            }
        }

        if (this.matchCount === this.size ** 2 / 2) {
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
        this.view.updateTimer(time);
    }

    stopTimer() {
        if (!this.timerId) return;
        clearInterval(this.timerId);
        this.timerId = null;
    }

    gameStart() {
        this.view.showDialog("LET'S PLAY", 'SELECT A LEVEL AND START GAME');
    }

    gameSuccess() {
        this.view.showDialog(
            'You Win!',
            `You won in ${this.timeLimit - this.timeLeft} seconds, using ${
                this.attempts
            } attempts<br />PLAY ANOTHER GAME`,
        );
    }

    gameOver() {
        this.view.showDialog('GAME OVER', 'CLICK TO PLAY AGAIN');
    }

    handleLevelChanged(e) {
        if (!e.target.id) return;
        this.view.updateLevel(e.target, this.level);
        this.level = +e.target.id.slice(-1);
        this.view.updateLevelDisplay(this.level);
        this.changeLevel();
    }

    changeLevel() {
        this.size = LEVELS[this.level].size;
        this.timeLimit = LEVELS[this.level].timeLimit;
        this.timerId = null;
        this.timeLeft = this.timeLimit;
    }
}

new GameManager();
