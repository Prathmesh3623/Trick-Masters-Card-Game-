const { createDeck, shuffle } = require("./deck");

let game = {

players: [],
deck: [],
hands: {},
turn: 0,
trick: [],
trump: null

};

function addPlayer(id){

game.players.push(id);

}

function startGame(){

game.deck = createDeck();

shuffle(game.deck);

dealCards();

}

function dealCards(){

game.players.forEach(p=>{

game.hands[p] = [];

});

for(let i=0;i<8;i++){

game.players.forEach(player=>{

const card = game.deck.pop();

game.hands[player].push(card);

});

}

}

function playCard(player,card){

game.trick.push({player,card});

}

module.exports = {

game,
addPlayer,
startGame,
playCard

};