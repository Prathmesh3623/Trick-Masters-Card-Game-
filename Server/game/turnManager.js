function getCurrentPlayer(game) {
    return game.players[game.currentTurnIndex]
}

function nextTurn(game) {
    game.currentTurnIndex =
        (game.currentTurnIndex + 1) % game.players.length

    return getCurrentPlayer(game)
}

module.exports = {
    getCurrentPlayer,
    nextTurn
}