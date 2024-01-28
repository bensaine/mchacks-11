import { ReactP5Wrapper } from "@p5-wrapper/react";
import { socket } from "../socket";
import { nanoid } from "nanoid";
import { css } from "@emotion/react";

const boothGap = 60;
const boothColumns = 3;

const boothsData = [
	{ name: "SSMU", image: "/ssmu.svg" },
	{ name: "Ensemble", image: "/Ensemble.png" },
	{ name: "Bell", image: "/Bell.png" },
	{ name: "NordVPN", image: "/Nord.png" },
	{ name: "Google Cloud", image: "/GoogleCloud.png" },
	{ name: "Telus", image: "/Telus.png" },
	{ name: "SpiceBros", image: "/SpiceBros.png" },
	{ name: "Incogni", image: "/incogni.png" },
];

const boothSize = 90;
const boothPadding = 50;
const textSize = 12;

function sketch(p5) {
	let boothObjs;
	let boothLocations;
	let font;
	let floor;
	let boothLayer;
	let emojis = []

	window.p5 = p5;
	class World {
		constructor() {
			this.player = new Player(true);
			this.player.init();
			this.otherPlayers = {};
		}
		updateState(state) {
			this.otherPlayers = state;
		}
		handleKeys(code) {
			if (code in keysMapping) {
				const displacement = keysMapping[code];
				console.log(`displacememt is ${displacement.x} ${displacement.y}`);
				this.player.updatePosition(displacement);
			}
		}
		display() {
			this.player.display();
			for (const [key, { x, y }] of Object.entries(this.otherPlayers)) {
				if (key !== this.player.id){
					const tempPlayer = new Player(false);
					tempPlayer.setPosition(x, y);
					tempPlayer.display();
				}
			}
		}
	}
	// debugger
	class Player {
		constructor(currentPlayer) {
			this.currentPlayer = currentPlayer
			this.position = p5.createVector(0, 0);
		}
		display() {
			p5.fill(255, 255, 255);
			p5.ellipse(this.position.x, this.position.y, 30, 30);
			if (this.currentPlayer) {
				p5.image(emojis[0], this.position.x - 7.5, this.position.y - 7.5, 15, 15)
			}
		}

		init() {
			this.id = nanoid();
			// alert("putting nanoid once!");
			socket.connect();
		}

		setPosition(x, y) {
			this.position = p5.createVector(x, y);
		}

		updatePosition(displacement) {
			this.position.add(displacement);
			// console.log(`updated position to ${this.position.x} ${this.position.y}`)
			const { x, y } = this.position;
			const id = this.id;
			socket.emit("user:update", { x, y, id });
		}
	}
	const world = new World();
	socket.on("state:update", (state) => {
		world.updateState(state);
	});

	function loadBooths() {
		let booths = [];
		boothLocations = []
		let rowCount = Math.ceil(boothsData.length / boothColumns);
		let yCenter = Math.floor(rowCount / 2)
		let xCenter = Math.floor(boothColumns / 2)
		let currentRow = 0;
		let rowPos = 0;
		let xOffset = (boothColumns * (boothSize + boothGap)) / 2;
		let yOffset = (rowCount * (boothSize + boothPadding + boothGap)) / 2;
		for (let booth of boothsData) {
			booths.push({
				imgObj: p5.loadImage(booth.image),
				name: booth.name,
			});
			boothLocations[booth.name] = {
				x: (boothSize + boothPadding + boothGap) * rowPos - xOffset,
				y:
					currentRow * (boothSize + boothPadding + textSize * 2 + boothGap) -
					yOffset,
			}
			if (currentRow === yCenter && xCenter == rowPos + 1) {
				rowPos++
			}
			if (rowPos === boothColumns - 1) {
				currentRow++;
				rowPos = 0;
			} else {
				rowPos++;
			}
		}
		return booths;
	}

	function drawBooths() {
		for (let booth of boothObjs) {
			drawBooth(
				booth.imgObj, 
				booth.name, 
				boothLocations[booth.name].x, 
				boothLocations[booth.name].y, 
				boothSize
			);
		}
		boothObjs = null
	}

	function drawBooth(imageObj, name, x, y, size) {
		boothLayer.textFont(font);
		boothLayer.textSize(textSize);
		boothLayer.textAlign(p5.CENTER);
		boothLayer.fill("black");
		boothLayer.text(name, x, y);
		let largestMeasurement = Math.max(imageObj.width, imageObj.height);
		let ratio = 1;
		if (largestMeasurement > size) {
			ratio = size / largestMeasurement;
		}
		let width = imageObj.width * ratio;
		let height = imageObj.height * ratio;
		boothLayer.strokeWeight(2);
		boothLayer.stroke("gray");
		boothLayer.fill(0, 0, 0, 0);
		boothLayer.rect(
			x - width / 2 - boothPadding / 2,
			y - textSize - boothPadding / 2,
			width + boothPadding,
			height + textSize * 2 + boothPadding,
			2
		);
		boothLayer.image(imageObj, x - width / 2, y + textSize, width, height);
		boothLayer.noStroke();
	}

	const UP = p5.createVector(0, -1);
	const DOWN = p5.createVector(0, 1);
	const LEFT = p5.createVector(-1, 0);
	const RIGHT = p5.createVector(1, 0);
	const keysMapping = {
		ArrowUp: UP,
		KeyW: UP,
		ArrowDown: DOWN,
		KeyS: DOWN,
		ArrowLeft: LEFT,
		KeyA: LEFT,
		ArrowRight: RIGHT,
		KeyD: RIGHT,
	};

	function addKeyListeners() {
		document.addEventListener("keydown", (e) => {
			world.handleKeys(e.code);
		});
	}

	p5.preload = () => {
		boothObjs = loadBooths();
		emojis = [
			p5.loadImage("/emojis/heart_eyes.svg"),
			p5.loadImage("/emojis/smile.svg"),
			p5.loadImage("/emojis/star_struck.svg"),
			p5.loadImage("/emojis/sunglasses.svg"),
		]
		floor = p5.loadImage("/floor.jpg");
		font = p5.loadFont("/fonts/NotoSans-Regular.ttf");
	};

	p5.setup = () => {
		p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL);
		boothLayer = p5.createGraphics(window.innerWidth, window.innerHeight, p5.WEBGL)
		drawBooths()
		addKeyListeners();
	};

	p5.draw = () => {
		p5.background(0, 0, 0);
		p5.image(
			floor,
			-p5.displayWidth / 2,
			-p5.displayHeight / 2,
			p5.displayWidth,
			p5.displayHeight
		);
		p5.image(boothLayer, -p5.displayWidth / 2,
			-p5.displayHeight / 2,
			p5.displayWidth,
			p5.displayHeight)
		world.display();
	};
}

let divStyle = css`
	display:flex;
	flex-direction:row;
	align-items:center;
	justify-content:center;
	height:100vh;
	width:100vw;
	overflow:hidden;
`

const Canvas = () => {
	return <div css={divStyle}>
		<ReactP5Wrapper sketch={sketch} />
	</div>;
};

export default Canvas;
