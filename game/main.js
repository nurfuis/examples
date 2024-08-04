import { gameParams } from "./constants.js";
import { Vector2 } from "./src/Vector2.js";
import { GameObject } from "./src/GameObject.js";
import { GameLoop } from "./src/GameLoop.js";
import { World } from "./src/World.js";
import { events } from "./src/Events.js";


const width = gameParams.width ?? window.innerWidth;
const height = gameParams.height ?? window.innerHeight;
const columns = 16;
const rows = 9;


const gameWrapper = createGameWrapper();
const gameCanvasMain = createGameCanvasMain();
const ctx = gameCanvasMain.getContext("2d");


const main = new GameObject({ position: new Vector2(0, 0) });

const world = new World(width, height, columns, rows)
main.addChild(world)


const update = (delta) => {
  main.stepEntry(delta, main);
};


const draw = () => {
  ctx.clearRect(0, 0, width, height);

  main.draw(ctx, 0, 0);

};


const gameLoop = new GameLoop(update, draw);


function createGameCanvasMain() {
  const gameCanvasMain = document.createElement("canvas");
  gameCanvasMain.id = "gameCanvas";
  gameCanvasMain.style.zIndex = "1";

  gameCanvasMain.width = width;
  gameCanvasMain.height = height;

  gameCanvasMain.style.backgroundColor = gameParams.backgroundColor;

  gameWrapper.appendChild(gameCanvasMain);

  gameCanvasMain.addEventListener("mousedown", (e) => {
    const rect = gameCanvasMain.getBoundingClientRect();

    const clickX = Math.round(e.clientX - rect.left);
    const clickY = Math.round(e.clientY - rect.top);
    const clickPos = new Vector2(clickX, clickY)

    events.emit("CLICK", clickPos)
    console.log(
      "Click:",
      clickX,
      clickY
    );
  });

  return gameCanvasMain;
}


function createGameWrapper() {
  const body = document.getElementsByTagName("body");
  const gameWrapper = document.createElement("div");
  gameWrapper.style.position = "relative";
  gameWrapper.style.display = "flex";
  gameWrapper.style.justifyContent = "center";
  gameWrapper.style.alignItems = "center";
  body[0].appendChild(gameWrapper);
  return gameWrapper;
}


window.onload = function () {
  gameLoop.start();
  console.log("Starting!")
};


