const httpServer = require("http").createServer()
const PORT = 4000
let counter = 0
function nanoid(){
	counter++
	return counter
}
const players = {}
const uidMap = {}
const io = require("socket.io")(httpServer, {
	cors: {
		origin: "*",
	},
})


const userUpdate = (userId) => ({ id, x, y ,info}) => {
	players[id] = { x, y, info }
	uidMap[userId] = id
	console.log("players is")
	console.log(players)
	io.emit("state:update", players)
}

const userDelete = (userId) => () => {
	// delete from uid map and from players
	const realUid = uidMap[userId]
	delete uidMap[userId]
	delete players[realUid]
}



const onConnection = (socket) => {
	const backendId = nanoid()
	console.log("onConnection invoked!")
	socket.on("user:update", userUpdate(backendId))
	socket.on('disconnect',userDelete(backendId))
}

io.on("connection", (socket) => {
	onConnection(socket)
	io.emit('state:update',players)
})

console.log(`listening on port ${PORT}`)
httpServer.listen(4000)
