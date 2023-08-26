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
        this.board = [
            { value: 'airplane' },
            { value: 'bag' },
            { value: 'ball' },
            { value: 'banana' },
            { value: 'boat' },
            { value: 'brush' },
            { value: 'cake' },
            { value: 'candy' },
            { value: 'airplane' },
            { value: 'bag' },
            { value: 'ball' },
            { value: 'banana' },
            { value: 'boat' },
            { value: 'brush' },
            { value: 'cake' },
            { value: 'candy' },
        ];

        this.boardContainer = document.querySelector('.board');
        this.init();
        this.listen();
    }

    listen() {
        document.querySelector('.reset-button').addEventListener('click', this.init.bind(this));
    }

    init() {
        this.clearBoard();
        this.shuffle();
        this.buildCards();
    }

    shuffle() {
        for (let i = this.board.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.board[i], this.board[j]] = [this.board[j], this.board[i]];
        }
    }

    clearBoard() {
        this.boardContainer.replaceChildren();
    }

    buildCards() {
        const boardFragment = document.createDocumentFragment();
        this.board.forEach((item, index) => {
            const cardElement = this.buildCardElement(item, index);
            boardFragment.appendChild(cardElement);
            this.board[index] = new Card(item.value, index);
        });
        this.boardContainer.appendChild(boardFragment);
        this.boardContainer.addEventListener('click', this.turn.bind(this));
    }

    revalCard(cardIndex) {
        const selectedCard = this.boardContainer.querySelector(`.card-${cardIndex}`);
        selectedCard.classList.add('opened');
        this.board[cardIndex].reveal();
    }

    concealCard(cardIndex) {
        const selectedCard = this.boardContainer.querySelector(`.card-${cardIndex}`);
        selectedCard.classList.remove('opened');
        this.board[cardIndex].conceal();
    }

    buildCardElement(item, index) {
        const liElement = document.createElement('li');
        liElement.setAttribute('class', `card card-${index}`);
        liElement.setAttribute('data-item', item.value);
        liElement.setAttribute('id', index);

        const divFrontElement = document.createElement('div');
        divFrontElement.setAttribute('class', 'front');

        const divBackElement = document.createElement('div');
        divBackElement.setAttribute('class', 'back');
        divBackElement.style.backgroundImage = `url(images/icons/${item.value}.svg)`;

        liElement.appendChild(divFrontElement);
        liElement.appendChild(divBackElement);

        return liElement;
    }

    isCardMatched() {
        return this.board[this.firstCard].value === this.board[this.secondCard].value;
    }

    pairMatched() {
        this.matchCount += 1;
        this.board[this.firstCard].isCardMatched = true;
        this.board[this.secondCard].isCardMatched = true;
        this.clearTurn();
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

        if (this.firstCard === selectedCard) return;

        // 이전 페어 확인 중일 때 발생하는 클릭 무시
        if (this.flipCount > 1) return;

        this.revalCard(selectedCard);
        this.flipCount += 1;

        if (this.flipCount === 1) {
            this.firstCard = selectedCard;
        } else {
            this.secondCard = selectedCard;
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
