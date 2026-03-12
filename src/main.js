const suits = ["S","H","D","C"]; 
const ranks = [
"A","2","3","4","5","6","7","8","9","10",
"J","Q","K"
];

let deck = [];
let playerHand = [];

function createDeck() {

  for (let suit of suits) {
    for (let rank of ranks) {

      deck.push({
        suit: suit,
        rank: rank,
        code: rank + suit
      });

    }
  }

}

createDeck();


const drawBtn = document.getElementById("drawBtn");
const deckCount = document.getElementById("deckCount");
const message = document.getElementById("message");
const playerHandUI = document.getElementById("playerHand");

function updateDeckCount(){
  deckCount.textContent = deck.length;
}


function createCardImage(card){

  const img = document.createElement("img");

  img.src = `https://deckofcardsapi.com/static/img/${card.code}.png`;

  img.classList.add("card-img");

  return img;
}


function drawCard(){

  if(deck.length === 0){
    message.textContent = "No cards left in the deck.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * deck.length);

  const card = deck.splice(randomIndex,1)[0];

  playerHand.push(card);

  message.textContent = `You drew ${card.rank} of ${card.suit}`;
  
  const cardImage = createCardImage(card);

  playerHandUI.appendChild(cardImage);

  updateDeckCount();

}

drawBtn.addEventListener("click", drawCard);

//updateDeckCount();