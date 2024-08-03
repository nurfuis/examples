const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

import { gameParams } from "./constants.js";
import { Vector2 } from "./src/Vector2.js";
import { GameObject } from "./src/GameObject.js";
import { GameLoop } from "./src/GameLoop.js";

const gameWrapper = createGameWrapper();
const gameCanvasMain = createGameCanvasMain();
const ctx = gameCanvasMain.getContext("2d");


const main = new GameObject({ position: new Vector2(0, 0) });


const update = (delta) => {
  main.stepEntry(delta, main);
  // console.log("Update...")
};
const draw = () => {
  ctx.clearRect(0, 0, windowWidth, windowHeight);

  main.draw(ctx, 0, 0);
  // console.log("Draw...")

};


const gameLoop = new GameLoop(update, draw);


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


window.onload = function () {
  gameLoop.start();
  console.log("Starting!")
};


