// game/gameState.js

function createGame(players) {
    return {
        players,
        deck: [],
        hands: {},
        currentTurnIndex: 0,
        trick: [],
        trumpSuit: null,
        scores: {}
    }
}

module.exports = { createGame }