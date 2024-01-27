import { ReactP5Wrapper } from "@p5-wrapper/react"
import { socket } from "../socket"
import { nanoid } from "nanoid"

function sketch(p5) {
	let boothObjs
	let font

	window.p5 = p5
	class World {
		constructor() {
			this.player = new Player()
			this.player.init()
			this.otherPlayers = {}
		}
		updateState(state) {
			this.otherPlayers = state
		}
		handleKeys(code) {
			if (code in keysMapping) {
				const displacement = keysMapping[code]
				console.log(`displacememt is ${displacement.x} ${displacement.y}`)
				this.player.updatePosition(displacement)
			}
		}
		display() {
			this.player.display()
			for (const [key, { x, y }] of Object.entries(this.otherPlayers)) {
				const tempPlayer = new Player()
				tempPlayer.setPosition(x, y)
				tempPlayer.display()
			}
		}
	}
	// debugger
	class Player {
		constructor() {
			this.position = p5.createVector(0, 0)
		}
		display() {
			p5.fill(255, 255, 255)
			p5.ellipse(this.position.x, this.position.y, 30, 30)
		}

		init() {
			this.id = nanoid()
			alert("putting nanoid once!")
			socket.connect()
		}

		setPosition(x, y) {
			this.position = p5.createVector(x, y)
		}

		updatePosition(displacement) {
			this.position.add(displacement)
			// console.log(`updated position to ${this.position.x} ${this.position.y}`)
			const { x, y } = this.position
			const id = this.id
			socket.emit("user:update", { x, y, id })
		}
	}
	const world = new World()
	socket.on("state:update", (state) => {
		world.updateState(state)
	})

	function loadBooths(boothData) {
		let booths = []
		for (let booth of boothData) {
			booths.push({ imgObj: p5.loadImage(booth.image), name: booth.name })
		}
		return booths
	}

	function drawBooth(imageObj, name, x, y, size) {
		let textSize = 12
		p5.textFont(font)
		p5.textSize(textSize)
		p5.textAlign(p5.CENTER)
		p5.text(name, x, y)
		p5.image(imageObj, x - size / 2, y + textSize, size, size)
	}

	const UP = p5.createVector(0, -1)
	const DOWN = p5.createVector(0, 1)
	const LEFT = p5.createVector(-1, 0)
	const RIGHT = p5.createVector(1, 0)
	const keysMapping = {
		ArrowUp: UP,
		KeyW: UP,
		ArrowDown: DOWN,
		KeyS: DOWN,
		ArrowLeft: LEFT,
		KeyA: LEFT,
		ArrowRight: RIGHT,
		KeyD: RIGHT,
	}
	function addKeyListeners() {
		document.addEventListener("keydown", (e) => {
			world.handleKeys(e.code)
		})
	}

	p5.preload = () => {
		boothObjs = loadBooths([{ name: "SSMU", image: "/ssmu.svg" }])
		font = p5.loadFont("/fonts/NotoSans-Regular.ttf")
	}

	p5.setup = () => {
		p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL)
		addKeyListeners()
	}

	p5.draw = () => {
		p5.background(0, 0, 0)
		world.display()
		drawBooth(boothObjs[0].imgObj, boothObjs[0].name, 100, 100, 50)
	}
}

const Canvas = () => {
	return <ReactP5Wrapper sketch={sketch} />
}

export default Canvas
