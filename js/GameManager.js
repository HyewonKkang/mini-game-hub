import { Card } from './Card.js';

const WAIT_SECONDS = 1000;

class GameManager {
    constructor(level = 0) {
        this.attempts = 0;
        this.flipCount = 0;
        this.matchCount = 0;
        this.level = level;
        this.size = level === 0 ? 4 : level === 1 ? 6 : 8;
        this.score = 0;
        this.firstCard = undefined;
        this.secondCard = undefined;
        this.board = [];

        this.boardContainer = document.querySelector('.board');

        this.init();
        this.listen();
    }

    listen() {
        document
            .querySelector('.reset-button')
            .addEventListener('click', this.startNewGame.bind(this));
    }

    init() {
        this.clearBoard();
        this.shuffleCards();
        this.buildCards();
    }

    startNewGame() {
        this.attempts = 0;
        this.flipCount = 0;
        this.matchCount = 0;
        this.score = 0;
        this.firstCard = undefined;
        this.secondCard = undefined;

        this.init();
    }

    shuffle(arr) {
        for (let i = this.board.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    shuffleCards() {
        const symbols = new Array(32).fill().map((_, index) => index);
        const randomSymbols = this.shuffle(symbols).slice(0, this.size * 2);
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
        liElement.setAttribute('class', `card`);
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
        await this.wait(WAIT_SECONDS);
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
        await this.wait(WAIT_SECONDS);
        this.concealCard(this.firstCard);
        this.concealCard(this.secondCard);
        this.clearTurn();
    }

    turn(e) {
        const selectedCard = e.target.parentElement.getAttribute('id');

        if (selectedCard === null) return;

        const selectedCardIndex = selectedCard.split('-')[1];

        if (this.board[selectedCardIndex].isRevealed) return;

        if (this.board[selectedCardIndex].isMatched) return;

        if (this.flipCount > 1) return; // 이전 페어 확인 중일 때 발생하는 클릭 무시

        this.revealCard(selectedCardIndex);
        this.flipCount += 1;

        if (this.flipCount === 1) {
            this.firstCard = selectedCardIndex;
        } else {
            this.secondCard = selectedCardIndex;
            this.attempts += 1;
            if (this.isCardMatched()) {
                this.pairMatched();
            } else {
                this.pairNotMatched();
            }
        }

        if (this.matchCount === this.size) {
            this.endGame();
        }
    }

    clearTurn() {
        this.firstCard = undefined;
        this.secondCard = undefined;
        this.flipCount = 0;
    }

    endGame() {}
}

new GameManager();
