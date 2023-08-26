export class Card {
    constructor(value, index) {
        this.value = value;
        this.index = index;
        this.isRevealed = false;
        this.isMatched = false;
    }

    reveal() {
        this.isRevealed = true;
    }

    conceal() {
        this.isRevealed = false;
    }
}
