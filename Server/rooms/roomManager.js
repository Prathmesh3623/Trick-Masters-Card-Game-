const rooms = {}

// create room if it doesn't exist
function createRoom(roomId){
rooms[roomId] = {
players: [],
game: null
}
}

function joinRoom(roomId, player){

if(!rooms[roomId]){
createRoom(roomId)
}

if(!rooms[roomId].players.includes(player)){
rooms[roomId].players.push(player)
}

}

module.exports = {
rooms,
createRoom,
joinRoom
}