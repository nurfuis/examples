import { Tile } from "./Tile.js";
import { GameObject } from "./GameObject.js";
import { Vector2 } from "./Vector2.js";
import { randomInt } from "./utils/randomInt.js";

import { Burrow } from "./features/Burrow.js";
import { Flower } from "./features/Flower.js";
import { Granary } from "./features/Granary.js";
import { Perch } from "./features/Perch.js";
import { Sapling } from "./features/Sapling.js";
import { Shrub } from "./features/Shrub.js";
import { Tree } from "./features/Tree.js";

const TERRAIN_TYPES = [
  { grass: { color: "lightgreen" } },
  { water: { color: "lightblue" } }, 
  { hills: { color: "gold" } }, 
  { mountains: { color: "brown" } },
  { forest: { color: "forestgreen" } },
  { swamp: { color: "#666" } },
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
  constructor(width, height, columns, rows) {
    super({
      position: new Vector2(0, 0),
    });
    this.width = width;
    this.height = height;

    this.columns = columns;
    this.rows = rows;

    this.gridWidth = Math.floor(width / columns);
    this.gridHeight = Math.floor(height / rows);

    this.tiles = [];

    this.baseTile = Tile;

    this.terrain = TERRAIN_TYPES;

    this.terrainCount = {};

    for (let i = 0; i < this.terrain.length; i++) {
      const terrain = this.terrain[i];
      const terrainType = Object.keys(terrain)[0];
      this.terrainCount[terrainType] = 0;
    }

    this.color = "rgba(255, 255, 255, 0.8)";
    this.border = 0;
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

  randomizeSaplings() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills" ||
        tile.type == "swamp"
      ) {
        const random = randomInt(0, 2);

        if (random === 0 || random === 1) {
          const random = randomInt(1, 4);
          const width = tile.width;
          const height = tile.height;

          const circleOffsets = [
            { x: -width / 2 + width / 5, y: 0 },
            { x: -width / 10, y: -height / 2 + height / 6 },
            { x: width / 2 - width / 3, y: 0 },
            { x: -width / 10, y: height / 2 - height / 3.5 },
          ];

          tile.newGrowth = [];

          for (let i = 0; i < random; i++) {
            const offset = circleOffsets[i]; // Access current offset based on loop counter
            const sapling = new Sapling();
            sapling.position.x = tile.position.x + tile.width / 2 + offset.x;
            sapling.position.y = tile.position.y + tile.height / 2 + offset.y;
            sapling.density = random;
            tile.addChild(sapling);
            tile.newGrowth.push(sapling);
          }
        }
      }
    }
  }

  randomizeBurrows() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills" ||
        tile.type == "grass" ||
        tile.type == "swamp"
      ) {
        const random = randomInt(0, 2);
        if (random === 0 || random === 1) {
          const burrow = new Burrow();
          burrow.position.x = tile.position.x + tile.width / 2 + tile.width / 4;
          burrow.position.y =
            tile.position.y + tile.height / 2 + tile.height / 4;
          tile.addChild(burrow);
          tile.subTerrain = burrow;
        }
      }
    }
  }

  randomizeFlowers() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills" ||
        tile.type == "grass" ||
        tile.type == "swamp"
      ) {
        const random = randomInt(0, 2);
        if (random === 0 || random === 1) {
          const random = randomInt(1, 3);
          const flower = new Flower();
          flower.position.x = tile.position.x + tile.width / 2 + tile.width / 4;
          flower.position.y =
            tile.position.y + tile.height / 4 + flower.height / 2;
          flower.density = random;
          tile.addChild(flower);
          tile.flora = flower;
        }
      }
    }
  }
  randomizeShrubs() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills" ||
        tile.type == "grass" ||
        tile.type == "swamp"
      ) {
        const random = randomInt(0, 2);
        if (random === 0 || random === 1) {
          const random = randomInt(1, 3);
          const shrub = new Shrub();
          shrub.position.x = tile.position.x + tile.width / 2 + tile.width / 4;
          shrub.position.y = tile.position.y + shrub.height;
          shrub.density = random;
          tile.addChild(shrub);
          tile.understory = shrub;
        }
      }
    }
  }
  randomizeTrees() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills" ||
        tile.type == "grass"
      ) {
        const random = randomInt(0, 3);
        if (random === 0) {
          const tree = new Tree();
          tree.position.x = tile.position.x + tile.width / 2 - tree.radius;
          tree.position.y = tile.position.y + tile.height / 2 - tree.radius;
          tile.addChild(tree);
          tile.vegetation = tree;
        }
      }
    }
  }
  randomizeGranaries() {
    for (const tile of this.children) {
      if (
        tile.type == "forest" ||
        tile.type == "mountains" ||
        tile.type == "hills"
      ) {
        const random = randomInt(0, 5);
        if (random === 0) {
          const granary = new Granary();
          granary.position.x = tile.position.x + tile.width / 8;
          granary.position.y = tile.position.y + tile.height / 8;
          tile.addChild(granary);
          tile.feature = granary;
        }
      }
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
  }
  adjustWaterTiles() {
    const waterSetting = WATER_LEVEL.semiDry;
    const waterCap = waterSetting * this.rows * this.columns;

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
    console.log("createGrid:", this)
  }
  ready() {
    this.createGrid();

    this.randomizeTerrain();

    this.buildGraph();

    this.adjustWaterTiles();
    this.adjustSwampTiles();


    this.randomizeTrees();
    this.randomizeShrubs();
    this.randomizeFlowers();
    this.randomizeBurrows();
    this.randomizePerch();
    this.randomizeSaplings();
    this.randomizeGranaries();

  }

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
