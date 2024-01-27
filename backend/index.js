const httpServer = require("http").createServer()
const PORT = 4000
const players = {}
const io = require("socket.io")(httpServer, {
	cors: {
		origin: "http://127.0.0.1:5173",
	},
})

function userUpdate({ id, x, y }) {
	players[id] = { x, y }
	console.log("players is")
	console.log(players)
	io.emit("state:update", players)
}

const onConnection = (socket) => {
	console.log("onConnection invoked!")
	socket.on("user:update", userUpdate)
}

io.on("connection", onConnection)

console.log(`listening on port ${PORT}`)
httpServer.listen(4000)
