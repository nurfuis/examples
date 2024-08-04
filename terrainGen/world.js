// import { Tile } from "./Cell.js";
// import { GameObject } from "./GameObject.js";
// import { Vector2 } from "./Vector2.js";
// import { randomInt } from "./utils/randomInt.js";
// import { COLUMNS, ROWS, WORLD_HEIGHT, WORLD_WIDTH } from "./constants.js";




const TERRAIN_TYPES = [
  { grass: { color: "hsl(90, 100%, 70%)" } },
  { water: { color: "hsl(220, 100%, 20%)" } },
  { hills: { color: "hsl(20, 70%, 70%)" } },
  { mountains: { color: "hsl(0, 100%, 40%)" } },
  { forest: { color: "hsl(100, 70%, 30%)" } },
  { swamp: { color: "hsl(180, 100%, 20%)" } },
];


const WATER_LEVEL = {
  arid: 0,
  dry: 0.1,
  semiDry: 0.2,
  wet: 0.3,
  wetter: 0.4,
  wettest: 0.5,
};


export class World extends GameObject {
  constructor() {
    super({
      position: new Vector2(0, 0),
    });
    this.width = WORLD_WIDTH;
    this.height = WORLD_HEIGHT;

    this.columns = COLUMNS;
    this.rows = ROWS;

    this.gridWidth = Math.floor(WORLD_WIDTH / COLUMNS);
    this.gridHeight = Math.floor(WORLD_HEIGHT / ROWS);

    this.tiles = [];

    this.baseTile = Tile;

    this.terrain = TERRAIN_TYPES;

    this.terrainCount = {};

    for (let i = 0; i < this.terrain.length; i++) {
      const terrain = this.terrain[i];
      const terrainType = Object.keys(terrain)[0];
      this.terrainCount[terrainType] = 0;
    }

    this.color = "rgba(255, 255, 255, 0.2)";
    this.border = 0;
  }

  createGrid() {
    let index = 0;
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const x1 = x * this.gridWidth;
        const y1 = y * this.gridHeight;

        const x2 = x1 + this.gridWidth;
        const y2 = y1 + this.gridHeight;

        this.addChild(new this.baseTile(x1, y1, x2, y2, index));
        index++;
      }
    }
  }

  randomizePerch() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills" ||
        tile.type == "grass" ||
        tile.type == "swamp"
      ) {
        const random = randomInt(0, 7);
        if (random === 0) {
          const perch = new Perch();
          perch.position.x = tile.position.x + tile.width / 8;
          perch.position.y =
            tile.position.y + tile.height / 2 + tile.height / 4;
          tile.addChild(perch);
          tile.highPoint = perch;
        }
      }
    }
  }

  randomizeTerrain() {
    for (const tile of this.children) {
      const numTerrainTypes = this.terrain.length;
      const randomTerrain = this.terrain[randomInt(0, numTerrainTypes - 1)];

      const terrainType = Object.keys(randomTerrain)[0];
      const terrainColor = randomTerrain[terrainType].color;
      this.terrainCount[terrainType]++;

      tile.type = terrainType;
      tile.color = terrainColor;
    }
  }

  adjustSwampTiles() {
    for (const tile of this.children) {
      let waterLevel = 0;

      if (tile.type == "swamp") {
        if (!!tile.left && tile.left.type == "water") {
          waterLevel++;
        }
        if (!!tile.up && tile.up.type == "water") {
          waterLevel++;
        }
        if (!!tile.right && tile.right.type == "water") {
          waterLevel++;
        }
        if (!!tile.down && tile.down.type == "water") {
          waterLevel++;
        }

        if (waterLevel < 1) {
          console.log("Swamp converted to forest");
          tile.type = "grass";
          tile.color = TERRAIN_TYPES[4].forest.color;
          this.terrainCount["forest"]++;
          this.terrainCount["swamp"]--;
          this.buildGraph();
        }
      }
    }
    console.log(this.terrainCount);
  }

  adjustWaterTiles() {
    const waterSetting = WATER_LEVEL.semiDry;
    const waterCap = waterSetting * ROWS * COLUMNS;
    console.log(
      "Water count: ",
      this.terrainCount["water"],
      "Water cap: ",
      waterCap
    );

    for (const tile of this.children) {
      if (tile.type != "water") {
        let waterLevel = 0;

        if (!!tile.left && tile.left.type == "water") {
          waterLevel++;
        }
        if (!!tile.up && tile.up.type == "water") {
          waterLevel++;
        }
        if (!!tile.right && tile.right.type == "water") {
          waterLevel++;
        }
        if (!!tile.down && tile.down.type == "water") {
          waterLevel++;
        }
        // console.log("waterLevel: ", waterLevel);
        if (waterLevel > 3 && this.terrainCount["water"] < waterCap) {
          tile.type = "water";
          tile.color = TERRAIN_TYPES[1].water.color;
          this.terrainCount["water"]++;
          this.buildGraph();
        }
      } else if (this.terrainCount["water"] > waterCap) {
        tile.type = "grass";
        tile.color = TERRAIN_TYPES[0].grass.color;
        this.terrainCount["grass"]++;
        this.terrainCount["water"]--;
        this.buildGraph();
      }
    }
    console.log(this.terrainCount);
  }

  buildGraph() {
    for (const tile of this.children) {

      const left = tile.parent?.children[tile.index - 1];
      if (!!left) {
        tile.left = left;
      }

      const right = tile.parent?.children[tile.index + 1];
      if (!!right) {
        tile.right = right;
      }

      const up = tile.parent?.children[tile.index - this.columns];
      if (!!up) {
        tile.up = up;
      }

      const down = tile.parent?.children[tile.index + this.columns];
      if (!!down) {
        tile.down = down;
      }
    }
  }

  ready() {
    this.createGrid();
    this.randomizeTerrain();

    this.buildGraph();
    this.adjustWaterTiles();
    this.adjustSwampTiles();



  drawImage(ctx) {
    ctx.beginPath();
    ctx.rect(
      this.border,
      this.border,
      this.width - this.border * 2,
      this.height - this.border * 2
    );
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
