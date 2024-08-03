const debug = true;

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

import { events } from "./src/Events.js";
import { Vector2 } from "./src/Vector2.js";
import { GameObject } from "./src/GameObject.js";
import { GameLoop } from "./src/GameLoop.js";

const gameWrapper = createGameWrapper();
const gameCanvasMain = createGameCanvasMain();
const ctx = gameCanvasMain.getContext("2d");


let main;

const update = (delta) => {

  main.stepEntry(delta, main);
  console.log(gameLoop.fps)
};
const draw = () => {
  ctx.clearRect(0, 0, windowWidth, windowHeight);

  main.draw(ctx, 0, 0);

};

const gameLoop = new GameLoop(update, draw);
gameLoop.name = "mainLoop";

function sortChildren(array) {
  array.children.sort((a, b) => {
    const aQuadrant =
      a.position.x >= 0
        ? a.position.y >= 0
          ? 1
          : 4
        : a.position.y >= 0
          ? 2
          : 3;
    const bQuadrant =
      b.position.x >= 0
        ? b.position.y >= 0
          ? 1
          : 4
        : a.position.y >= 0
          ? 2
          : 3;

    if (aQuadrant !== bQuadrant) {
      return aQuadrant - bQuadrant;
    } else {
      if (a.position.y !== b.position.y) {
        return a.position.y - b.position.y;
      } else {
        return a.position.x - b.position.x;
      }
    }
  });
}

function createGameCanvasMain() {
  const gameCanvasMain = document.createElement("canvas");
  gameCanvasMain.id = "gameCanvas";
  gameCanvasMain.style.zIndex = "1";

  gameCanvasMain.width = windowWidth;
  gameCanvasMain.height = windowHeight;

  gameCanvasMain.style.backgroundColor = gameParams.backgroundColor;

  gameWrapper.appendChild(gameCanvasMain);
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
function createStartButton() {
  const body = document.getElementsByTagName("body");

  const startContainer = document.createElement("div");
  startContainer.classList.add("container");

  const startChild = document.createElement("div");
  startContainer.appendChild(startChild);

  const startButton = document.createElement("button");
  startButton.textContent = "Start";
  startButton.id = "start";
  startButton.addEventListener("click", () => {
    startMain();
    startContainer.remove();
    console.log("Start!");
  });

  startChild.appendChild(startButton);

  body[0].appendChild(startContainer);
  return startContainer;
}

async function startMain() {
  main = new GameObject({ position: new Vector2(0, 0) });

  if (debug) console.log(main);

  gameLoop.start();

  gameCanvasMain.addEventListener("mousedown", (e) => {
    const rect = gameCanvasMain.getBoundingClientRect();

    const clickX = Math.round(e.clientX - rect.left);
    const clickY = Math.round(e.clientY - rect.top);

    const clickPos = new Vector2(clickX, clickY);

    events.emit("CLICK", clickPos )

    console.log(
      "Click: ", clickPos
    );
  });
}

window.onload = function () {
  if (!AUTO_START) createStartButton();
};


