document.addEventListener("DOMContentLoaded", () => {

const socket = io("http://localhost:3001")

let myId = null
let currentTurn = null
let currentHand = []
let roomId = "room1"

let players = []
let myIndex = -1
let trumpSuit = null
let gameStarted = false

// ==========================
// CONNECT
// ==========================

socket.on("connect", () => {
myId = socket.id
})

// ==========================
// JOIN
// ==========================

document.getElementById("join").onclick = () => {


const name = document.getElementById("playerName").value.trim()

if (!name) return alert("Enter name")

socket.emit("joinRoom", { roomId, name })


}

// ==========================
// READY
// ==========================

document.getElementById("readyBtn").onclick = () => {
socket.emit("playerReady")
}

// ==========================
// LOBBY UPDATE
// ==========================

socket.on("lobbyUpdate", (list) => {


const container = document.getElementById("lobbyPlayers")
container.innerHTML = ""

list.forEach(p => {

    const div = document.createElement("div")
    div.innerText = p.name + (p.ready ? " ✅" : " ❌")

    container.appendChild(div)
})


})

// ==========================
// PLAYER COUNT
// ==========================

socket.on("playerCount", (count) => {
document.getElementById("playerCount").innerText = count
})

// ==========================
// START GAME
// ==========================

socket.on("startGame", () => {

    gameStarted = true

    document.getElementById("lobby").style.display = "none"

    const table = document.getElementById("table")
    table.style.display = "block"

    // 🔥 CRITICAL FIX (wait for DOM paint)
    setTimeout(() => {
        console.log("HAND AFTER SHOW:", document.getElementById("hand"))
        renderHand()
    }, 100)
})

// ==========================
// PLAYERS LIST
// ==========================

socket.on("playersList", (list) => {


players = list
myIndex = players.findIndex(p => p.id === myId)

updateNames()


})

function updateNames() {

    const map = ["bottom","left","top","right"]

    players.forEach((p,i) => {

        const pos = map[(i - myIndex + 4) % 4]
        const el = document.querySelector(`.${pos}`)

        if (!el) return

        // 🔥 ONLY update name element (NOT whole container)
        let nameEl = el.querySelector(".name")

        // fallback for other players (top/left/right)
        if (!nameEl) {
            el.textContent = (p.id === myId) ? "You" : p.name
        } else {
            nameEl.textContent = (p.id === myId) ? "You" : p.name
        }
    })
}

// ==========================
// TRUMP
// ==========================

socket.on("trumpSuit", (suit) => {


trumpSuit = suit

const icons = {H:"♥",D:"♦",C:"♣",S:"♠"}
document.getElementById("trumpIcon").innerText = icons[suit]


})

// ==========================
// HAND
// ==========================

socket.on("playerHand", (cards) => {


console.log("🔥 CARDS RECEIVED:", cards)

currentHand = cards

// render only if UI visible
if (gameStarted) {
    renderHand()
}


})

// ==========================
// RENDER HAND
// ==========================

   // const img = document.createElement("img")
   /// img.src = `cards/${card}.png`
   // img.className = "card"

  function renderHand() {

    const hand = document.getElementById("hand")

    if (!hand) {
        console.log("⚠️ hand container not found yet")
        return
    }

    hand.innerHTML = ""

    currentHand.forEach((card) => {

        console.log("Rendering:", card)

        const fixedCard = card.replace("0", "10")

        const img = document.createElement("img")
        img.src = `cards/${fixedCard}.png`
        img.className = "card"

        // trump highlight
        if (card.slice(-1) === trumpSuit) {
            img.classList.add("trump-card")
        }

        // drag
        img.draggable = (currentTurn === myId)

        img.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("card", card)
        })

        hand.appendChild(img)
    })
}
// ==========================
// DROP
// ==========================

const center = document.getElementById("center")

center.addEventListener("dragover", e => e.preventDefault())

center.addEventListener("drop", (e) => {


e.preventDefault()

if (currentTurn !== myId) return

const card = e.dataTransfer.getData("card")

socket.emit("playCard", { roomId, card })


})

// ==========================
// POSITION
// ==========================

function getPos(playerId) {


const index = players.findIndex(p => p.id === playerId)
return ["bottom","left","top","right"][(index - myIndex + 4) % 4]


}

// ==========================
// CARD PLAYED
// ==========================

socket.on("cardPlayed", ({ playerId, card }) => {


const map = {
    top:"cardTop",
    left:"cardLeft",
    right:"cardRight",
    bottom:"cardBottom"
}

const el = document.getElementById(map[getPos(playerId)])
if (el) el.src = `cards/${card}.png`

if (playerId === myId) {
    currentHand = currentHand.filter(c => c !== card)
    renderHand()
}


})

// ==========================
// TURN
// ==========================

socket.on("turnChanged", (id) => {


currentTurn = id

const player = players.find(p => p.id === id)

let text = ""

if (id === myId) {
    text = "🟢 Your Turn"
} else {
    const name = player && player.name ? player.name : "Opponent"
    text = "🔴 " + name + " Turn"
}

document.getElementById("message").innerText = text

renderHand()


})

// ==========================
// RESET
// ==========================

socket.on("resetTable", () => {


["cardTop","cardLeft","cardRight","cardBottom"]
    .forEach(id => {
        const el = document.getElementById(id)
        if (el) el.src = ""
    })


})

// ==========================
// SCORE
// ==========================

socket.on("scoreUpdate", (scores) => {


document.getElementById("score").innerText =
    `Team A: ${scores.teamA} | Team B: ${scores.teamB}`


})

// ==========================
// WINNER
// ==========================

socket.on("trickWinner", ({ playerId }) => {


const index = players.findIndex(p => p.id === playerId)
const team = (index === 0 || index === 2) ? "Team A" : "Team B"

const popup = document.getElementById("winnerPopup")

popup.innerText = `${team} won the trick!`
popup.style.display = "block"

setTimeout(() => popup.style.display = "none", 1500)


})

})
