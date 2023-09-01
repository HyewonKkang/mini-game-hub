import { Card } from './Card.js';

const STAR = '★';
const EMPTY_STAR = '☆';

export class View {
    constructor() {
        this.boardContainer = document.querySelector('.board');
        this.timerElement = document.querySelector('.timer');
        this.dialogElement = document.querySelector('.dialog');
        this.levelElement = document.querySelector('.level');
        this.attemptsCountElement = document.querySelector('.attempt').querySelector('span');
    }

    listen(
        playButtonClickCallback,
        resetButtonClickCallback,
        levelChangeCallback,
        CardClickCallback,
    ) {
        this.dialogElement.querySelector('.play-button').addEventListener('click', () => {
            this.dialogElement.close();
            playButtonClickCallback();
        });

        document.querySelector('.reset-button').addEventListener('click', resetButtonClickCallback);

        document.querySelector('.levels').addEventListener('click', levelChangeCallback);

        this.boardContainer.addEventListener('click', CardClickCallback);
    }

    createCards(cards, level) {
        const boardFragment = document.createDocumentFragment();
        const _board = cards.map((item, index) => {
            const cardElement = this.buildCardElement(item, index, level);
            boardFragment.appendChild(cardElement);
            return new Card(item, index);
        });
        this.boardContainer.appendChild(boardFragment);
        return _board;
    }

    buildCardElement(item, index, level) {
        const liElement = document.createElement('li');
        liElement.setAttribute('class', `card card-${level}`);
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

    showDialog(title, message) {
        this.dialogElement.querySelector('h2').textContent = title;
        this.dialogElement.querySelector('p').innerHTML = message;
        this.dialogElement.showModal();
    }

    makeTimeFormat(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    updateTimer(time) {
        this.timerElement.textContent = this.makeTimeFormat(time);
    }

    updateAttemptsCount(count) {
        this.attemptsCountElement.textContent = count;
    }

    updateLevel(target, prevLevel) {
        target.classList.add('selected');
        document.querySelector(`#lv-${prevLevel}`).classList.remove('selected');
    }

    updateLevelDisplay(level) {
        let content = '';
        for (var i = 0; i < level + 1; i++) {
            content += STAR;
        }
        for (var i = 0; i < 2 - level; i++) {
            content += EMPTY_STAR;
        }

        this.levelElement.textContent = content;
    }

    clearBoard() {
        this.boardContainer.replaceChildren();
    }

    markCardAsOpened(cardIndex) {
        const selectedCard = this.boardContainer.querySelector(`#card-${cardIndex}`);
        selectedCard.classList.add('opened');
    }

    markCardAsConcealed(cardIndex) {
        const selectedCard = this.boardContainer.querySelector(`#card-${cardIndex}`);
        selectedCard.classList.remove('opened');
    }

    markCardAsMatched(cardIndex) {
        const matchedCard = this.boardContainer.querySelector(`#card-${cardIndex}`);
        matchedCard.classList.add('matched');
    }
}
