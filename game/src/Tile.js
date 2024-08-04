import { Vector2 } from "./Vector2.js";
import { GameObject } from "./GameObject.js";

export class Tile extends GameObject {
  constructor(x1, y1, x2, y2, index) {
    super({
      position: new Vector2(x1, y1),
    });
    this.position2 = new Vector2(x2, y2);

    this.width = x2 - x1;
    this.height = y2 - y1;
    this.index = index;
    this.color = "rgba(5, 155, 55, 1)";
  }

  drawImage(ctx) {
    ctx.beginPath();
    ctx.rect(
      this.position.x + 1,
      this.position.y + 1,
      this.width - 2,
      this.height - 2
    );

    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
  }
}
