// game/deck.js

function createDeck() {
    const suits = ["H", "D", "C", "S"]

    // 8 ranks
    const values = ["7", "8", "9", "0", "J", "Q", "K", "A"]

    let deck = []

    for (let suit of suits) {
        for (let value of values) {
            deck.push(value + suit)
        }
    }

    return deck
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
    return deck
}

module.exports = { createDeck, shuffle }