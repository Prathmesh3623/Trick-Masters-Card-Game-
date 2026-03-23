// server/game/trickManager.js

function getSuit(card) {
    return card.slice(-1)
}

function getValue(card) {
    return card.slice(0, -1)
}

const valueRank = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "0": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14
}


// ==========================
// ADD CARD TO TRICK
// ==========================
function addCardToTrick(game, playerId, card) {
    if (!game.trick) game.trick = []
    game.trick.push({ playerId, card })
}


// ==========================
// CHECK COMPLETE
// ==========================
function isTrickComplete(game) {
    return game.trick.length === 4
}


// ==========================
// RESOLVE WINNER
// ==========================
function resolveTrick(game) {

    const trump = game.trumpSuit
    const leadSuit = getSuit(game.trick[0].card)

    let winning = game.trick[0]

    for (let play of game.trick) {

        const suit = getSuit(play.card)
        const value = valueRank[getValue(play.card)]

        const winSuit = getSuit(winning.card)
        const winValue = valueRank[getValue(winning.card)]

        if (suit === trump && winSuit !== trump) {
            winning = play
        }
        else if (suit === winSuit && value > winValue) {
            winning = play
        }
        else if (winSuit !== trump && suit === leadSuit && winSuit !== leadSuit) {
            winning = play
        }
    }

    return winning.playerId
}


// ==========================
// RESET
// ==========================
function resetTrick(game) {
    game.trick = []
}


// ✅ EXPORT EVERYTHING PROPERLY
module.exports = {
    addCardToTrick,
    isTrickComplete,
    resolveTrick,
    resetTrick
}