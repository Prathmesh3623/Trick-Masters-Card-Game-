const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const { createDeck, shuffle } = require("./game/deck")
const { createGame } = require("./game/gameState")
const { rooms } = require("./rooms/roomManager")
const { getCurrentPlayer, nextTurn } = require("./game/turnManager")

const {
addCardToTrick,
isTrickComplete,
resolveTrick,
resetTrick
} = require("./game/trickManager")

const { initScore, addPoint } = require("./game/scoreManager")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
cors: { origin: "*" }
})

const PORT = 3001

app.use(express.static("src"))
app.use("/cards", express.static("cards"))

// ==========================
// DEAL CARDS
// ==========================

function dealCards(game) {
game.players.forEach(p => game.hands[p] = [])

for (let i = 0; i < 8; i++) {
game.players.forEach(player => {
game.hands[player].push(game.deck.pop())
})
}
}

// ==========================
// HELPER
// ==========================

function getSuit(card) {
return card.slice(-1)
}

// ==========================
// SOCKET
// ==========================

io.on("connection", (socket) => {

// ==========================
// JOIN ROOM
// ==========================

socket.on("joinRoom", ({ roomId, name }) => {


socket.roomId = roomId

if (!rooms[roomId]) {
  rooms[roomId] = {
    players: [],
    game: null,
    started: false
  }
}

const room = rooms[roomId]

if (room.players.find(p => p.id === socket.id)) return

if (room.players.length >= 4) {
  socket.emit("errorMessage", "Room full")
  return
}

room.players.push({
  id: socket.id,
  name: name || "Player",
  ready: false
})

socket.join(roomId)

io.to(roomId).emit("lobbyUpdate", room.players)

// ✅ FIX: send player count
io.to(roomId).emit("playerCount", room.players.length)


})

// ==========================
// READY
// ==========================

socket.on("playerReady", () => {


const roomId = socket.roomId
const room = rooms[roomId]

if (!room) return

const player = room.players.find(p => p.id === socket.id)
if (player) player.ready = true

io.to(roomId).emit("lobbyUpdate", room.players)

if (room.players.length === 4 && room.players.every(p => p.ready)) {

  console.log("🔥 GAME STARTING")

  room.started = true

  const playerIds = room.players.map(p => p.id)

  room.game = createGame(playerIds)
  room.game.deck = shuffle(createDeck())

  dealCards(room.game)
  initScore(room.game)

  // send player order
  io.to(roomId).emit("playersList", room.players)

  // trump
  const suits = ["H","D","C","S"]
  room.game.trumpSuit = suits[Math.floor(Math.random()*4)]
  io.to(roomId).emit("trumpSuit", room.game.trumpSuit)

  // ✅ IMPORTANT FIX: start first
  io.to(roomId).emit("startGame")

  // ✅ THEN send hands
  room.players.forEach(p => {
    const hand = room.game.hands[p.id] || []
    io.to(p.id).emit("playerHand", hand)
  })

  // first turn
  io.to(roomId).emit("turnChanged", playerIds[0])
}


})

// ==========================
// PLAY CARD
// ==========================

socket.on("playCard", ({ roomId, card }) => {


const room = rooms[roomId]
if (!room || !room.game) return

const game = room.game

const currentPlayer = getCurrentPlayer(game)
if (currentPlayer !== socket.id) return

const hand = game.hands[socket.id]
if (!hand || !hand.includes(card)) return

// follow suit rule
if (game.trick.length > 0) {
  const leadSuit = getSuit(game.trick[0].card)
  const hasSuit = hand.some(c => getSuit(c) === leadSuit)

  if (hasSuit && getSuit(card) !== leadSuit) return
}

game.hands[socket.id] = hand.filter(c => c !== card)

addCardToTrick(game, socket.id, card)

io.to(roomId).emit("cardPlayed", {
  playerId: socket.id,
  card
})

const next = nextTurn(game)
io.to(roomId).emit("turnChanged", next)


if (isTrickComplete(game)) {

  setTimeout(() => {

    const winner = resolveTrick(game)

    const winningPlay = game.trick.find(p => p.playerId === winner)

    addPoint(game, winner)

    io.to(roomId).emit("trickWinner", {
      playerId: winner,
      card: winningPlay.card
    })

    io.to(roomId).emit("scoreUpdate", game.scores)

    resetTrick(game)

    game.currentTurnIndex = game.players.indexOf(winner)

    io.to(roomId).emit("resetTable")
    io.to(roomId).emit("turnChanged", winner)

  }, 1500)
}


})

// ==========================
// DISCONNECT
// ==========================

socket.on("disconnect", () => {


for (let roomId in rooms) {

  const room = rooms[roomId]

  const index = room.players.findIndex(p => p.id === socket.id)

  if (index !== -1) {

    room.players.splice(index, 1)

    room.started = false
    room.game = null

    io.to(roomId).emit("lobbyUpdate", room.players)
    io.to(roomId).emit("playerCount", room.players.length)
  }
}


})

})

server.listen(PORT, () => {
console.log("Server running on port", PORT)
})
