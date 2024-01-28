import { useRef, useEffect, useState } from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { socket } from "../socket";
import { nanoid } from "nanoid";
import { usePeerHelper } from "../peerSetup";
import { VideoStreams, VideoStream } from "./VideoStreams";
import p5 from "p5";

const VELOCITY_MULTIPLIER = 5;
const UP = new p5.Vector(0, -1);
const DOWN = new p5.Vector(0, 1);
const LEFT = new p5.Vector(-1, 0);
const RIGHT = new p5.Vector(1, 0);
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

class World {
  constructor(createPeerHelper) {
    this.player = new Player();
    this.player.init();
    this.otherPlayers = {};
    this.helper = createPeerHelper(this.player.id);
    this.p5 = null;
    // this.helper.getStream();
    window.helper = this.helper;
  }
  updateState(state) {
    this.otherPlayers = state;
  }
  handleKeys(code) {
    if (code in keysMapping) {
      const displacement = keysMapping[code];
      this.player.updatePosition(displacement);
    }
  }
  display(sketch) {
    this.player.display(sketch);
    for (const [key, { x, y }] of Object.entries(this.otherPlayers)) {
      if (key === this.player.id) continue;
      const tempPlayer = new Player();
      tempPlayer.setPosition(x, y);
      tempPlayer.display(sketch);
    }
  }

  checkAllCalls() {
    // i check otherPlayers vs peerhelper
    for (const [playerId, position] of Object.entries(this.otherPlayers)) {
      const otherPosition = new p5.Vector(position.x, position.y);
      if (this.player.closeEnough(otherPosition)) {
        // if not already calling
        if (!this.helper.contacting(playerId)) {
          // then the one with lowest id initiates a call
          //   if (this.player.id < playerId) {
          this.helper.call(playerId);
          //   }
        }
      } else {
        // end stream
        this.helper.close(playerId);
      }
    }
  }
}
// debugger
class Player {
  constructor() {
    this.position = new p5.Vector(0, 0);
  }
  display(sketch) {
    sketch.fill(255, 255, 255);
    sketch.ellipse(this.position.x, this.position.y, 30, 30);
  }

  init() {
    this.id = nanoid();
    socket.connect();
  }

  setPosition(x, y) {
    this.position = new p5.Vector(x, y);
  }

  updatePosition(displacement) {
    const scaledDisplacement = new p5.Vector(
      displacement.x * VELOCITY_MULTIPLIER,
      displacement.y * VELOCITY_MULTIPLIER
    );
    this.position.add(scaledDisplacement);
    // console.log(`updated position to ${this.position.x} ${this.position.y}`)
    const { x, y } = this.position;
    const id = this.id;
    socket.emit("user:update", { x, y, id });
  }

  closeEnough(otherPosition) {
	const difference = Math.abs(otherPosition.x - this.position.x) + Math.abs(otherPosition.y-this.position.y)
	return difference < 100
  }
}

const Canvas = () => {
  const { createPeerHelper, streams, loadedWebcam } = usePeerHelper();
  const sketchRef = useRef(null);
  const worldRef = useRef(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const world = new World(createPeerHelper);
    window.world = world;
    worldRef.current = world;
    const sketch = (p5) => {
      let boothObjs;
      let font;
      let boothLayer;

      window.p5 = p5;
      socket.on("state:update", (state) => {
        world.updateState(state);
      });

      function loadBooths(boothData) {
        let booths = [];
        for (let booth of boothData) {
          booths.push({ imgObj: p5.loadImage(booth.image), name: booth.name });
        }
        return booths;
      }

	function drawBooth(imageObj, name, x, y, size) {
		boothLayer.textFont(font);
		boothLayer.textSize(textSize);
		boothLayer.textAlign(p5.CENTER);
		boothLayer.fill(36, 36, 36);
		boothLayer.text(name, x, y);
		let largestMeasurement = Math.max(imageObj.width, imageObj.height);
		let ratio = 1;
		if (largestMeasurement > size) {
			ratio = size / largestMeasurement;
		}
		let width = imageObj.width * ratio;
		let height = imageObj.height * ratio;
		boothLayer.strokeWeight(2);
		boothLayer.stroke(36, 36, 36);
		boothLayer.fill(0, 0, 0, 0);
		boothLayer.rect(
			x - width / 2 - boothPadding / 2,
			y - textSize - boothPadding / 2,
			width + boothPadding,
			height + textSize * 2 + boothPadding,
			5
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

	p5.updateWithProps = props => {
		if (props.avatar) {
			avatar = props.avatar
		}
	};

	p5.preload = () => {
		boothObjs = loadBooths();
		emojis = {
			heart_eyes:p5.loadImage("/emojis/heart_eyes.svg"),
			smile:p5.loadImage("/emojis/smile.svg"),
			star_struck:p5.loadImage("/emojis/star_struck.svg"),
			sunglasses:p5.loadImage("/emojis/sunglasses.svg"),
		}
		floor = p5.loadImage("/floor.jpg");
		font = p5.loadFont("/fonts/NotoSans-Bold.ttf");
	};

      p5.setup = () => {
        p5.createCanvas(500, 500, p5.WEBGL);
        boothLayer = p5.createGraphics(
          window.innerWidth,
          window.innerHeight,
          p5.WEBGL
        );
        drawBooth(boothObjs[0].imgObj, boothObjs[0].name, 100, 100, 50);
        addKeyListeners();
      };

      let i = 0;
      p5.draw = () => {
        if (i % 15 === 0) {
          p5.background(0, 0, 0);
          p5.image(
            boothLayer,
            -p5.displayWidth / 2,
            -p5.displayHeight / 2,
            p5.displayWidth,
            p5.displayHeight
          );
          world.display(p5);
          world.checkAllCalls();
        }
        i = (i + 1) % 4;
      };
    };
    sketchRef.current = sketch;
    setLoading(false);
  }, []);
  return loading ? (
    "loading"
  ) : (
    <div>
      <ReactP5Wrapper sketch={sketchRef.current}></ReactP5Wrapper>
      <VideoStreams streams={streams} />
      {loadedWebcam && <VideoStream stream={helper.selfStream} />}
    </div>
  );
};

export default Canvas;
export default Canvas;
