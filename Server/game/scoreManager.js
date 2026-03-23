// game/scoreManager.js

function initScore(game) {

    game.scores = {
        teamA: 0, // players 0 & 2
        teamB: 0  // players 1 & 3
    }
}


function addPoint(game, winnerId) {

    const index = game.players.indexOf(winnerId)

    if (index === 0 || index === 2) {
        game.scores.teamA += 1
    } else {
        game.scores.teamB += 1
    }
}

module.exports = {
    initScore,
    addPoint
}