console.log("connected");

//Player
class Player {
  constructor() {
    this.domElm = null;
    this.height = 30;
    this.width = 10;
    this.positionX = 50;
    this.positionY = 20;
    this.createDomElm();
  }
  createDomElm() {
    this.domElm = document.createElement("div");
    this.domElm.id = "player";
    this.domElm.style.backgroundImage = "url(../imgs/player.png)";
    this.domElm.style.height = this.height + "vh";
    this.domElm.style.width = this.width + "vw";
    this.domElm.style.left = this.positionX + "vw";
    this.domElm.style.bottom = this.positionY + "vh";
    const board = document.getElementById("board");
    board.appendChild(this.domElm);

    console.log("new player", this.domElm.style);
  }
  moveUp() {
    if (this.positionY < 44) {
      this.positionY++;
      this.domElm.style.bottom = this.positionY + "vh";

      console.log("Up", `new position is ${this.positionY}`);
    } else {
      console.log("Hit wall, cant move");
      return;
    }
  }
  moveDown() {
    if (this.positionY <= 0) {
      console.log("Hit wall, cant move");
      return;
    } else {
      this.positionY--;
      this.domElm.style.bottom = this.positionY + "vh";

      console.log("Down", `new position is ${this.positionY}`);
    }
  }
  moveLeft() {
    if (this.positionX <= 0) {
      console.log("Hit wall, cant move");
      return;
    } else {
      this.positionX--;
      this.domElm.style.left = this.positionX + "vw";
      console.log("Left", `new position is ${this.positionX}`);
    }
  }
  moveRight() {
    if (this.positionX < 100 - this.width) {
      this.positionX++;
      this.domElm.style.left = this.positionX + "vw";
      console.log("Right", `new position is ${this.positionX}`);
    } else {
      console.log("Hit wall, cant move");
      return;
    }
  }
}

//collectible items

class Item {
  constructor(id, imageNum) {
    this.domElm = null;
    this.height = 15;
    this.width = 15;
    this.positionX = Math.floor(Math.random() * (100 - this.width));
    this.positionY = Math.floor(Math.random() * (75 - this.height));
    this.createDomElm(id, imageNum);
  }
  createDomElm(id, imageNum) {
    this.domElm = document.createElement("div");
    this.domElm.id = "item" + id;
    this.domElm.classList.add("items");
    this.domElm.style.color = "red";
    this.domElm.style.backgroundImage = `url(../imgs/item${imageNum}.png)`; //can think of way to change the code to be more dynamic
    this.domElm.style.height = this.height + "vh";
    this.domElm.style.width = this.width + "vw";
    this.domElm.style.left = this.positionX + "vw";
    this.domElm.style.bottom = this.positionY + "vh";
    const board = document.getElementById("board");
    board.appendChild(this.domElm);

    console.log("new item", this.domElm.style);
  }
}

//game start

const player = new Player();

//randomly set image to items
const numItems = 5; //if there are more images for items, change the number - also can consider to change the hardcode
let itemArr = [];
let usedImages = []; //track used image

for (let i = 0; i < numItems; i++) {
  let imageNum = Math.floor(Math.random() * 5) + 1;

  // if the generated number is already used, find another one
  if (usedImages.includes(imageNum)) {
    i--; //to ensure that a new item is not created for the current i value until a unique image number is found.
    continue;
  }

  usedImages.push(imageNum); // keep track of used image to the usedImages array
  itemArr[i] = new Item(i + 1, imageNum);
}

//attach event listener
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowUp":
      player.moveUp();
      break;
    case "ArrowDown":
      player.moveDown();
      break;
    case "ArrowLeft":
      player.moveLeft();
      break;
    case "ArrowRight":
      player.moveRight();
      break;
  }
});
