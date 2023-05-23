// console.log("connected");

//Player
class Player {
  constructor() {
    this.score = 0;
    this.domElm = null;
    this.height = 30;
    this.width = 8;
    this.positionX = 20;
    this.positionY = 37;
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

    // console.log("new player", this.domElm.style);
  }
  moveUp() {
    if (this.positionY < 44) {
      this.positionY++;
      this.domElm.style.bottom = this.positionY + "vh";

      // console.log("Up", `new position is ${this.positionY}`);
    } else {
      // console.log("Hit wall, cant move");
      return;
    }
  }
  moveDown() {
    if (this.positionY <= 0) {
      // console.log("Hit wall, cant move");
      return;
    } else {
      this.positionY--;
      this.domElm.style.bottom = this.positionY + "vh";

      // console.log("Down", `new position is ${this.positionY}`);
    }
  }
  moveLeft() {
    if (this.positionX <= 0) {
      // console.log("Hit wall, cant move");
      return;
    } else {
      this.positionX--;
      this.domElm.style.left = this.positionX + "vw";
      // console.log("Left", `new position is ${this.positionX}`);
    }
  }
  moveRight() {
    if (this.positionX < 100 - this.width) {
      this.positionX++;
      this.domElm.style.left = this.positionX + "vw";
      // console.log("Right", `new position is ${this.positionX}`);
    } else {
      // console.log("Hit wall, cant move");
      return;
    }
  }
  isColliding(item) {
    return (
      this.positionX < item.positionX + item.width / 2 &&
      this.positionX + this.width / 2 > item.positionX &&
      this.positionY < item.positionY + item.height / 2 &&
      this.positionY + this.height - 3 > item.positionY
    );
  }
}

//collectible items

class Item {
  constructor(id, imageNum) {
    this.imageNum = imageNum;
    this.domElm = null;
    this.height = 15;
    this.width = 10;
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
    // console.log("new item", this.domElm.style);
  }
}

//game start

//create items & randomly set image to items

let itemArr = [];
let usedImages = [];
const itemCreationDelay = 3000;
const itemRemovalDelay = 5000;
const itemLifeTime = itemCreationDelay + itemRemovalDelay;

const createItem = (numImgs, id) => {
  let imageNum;
  do {
    imageNum = Math.floor(Math.random() * numImgs) + 1;
  } while (usedImages.includes(imageNum));

  usedImages.push(imageNum);
  if (usedImages.length === numImgs) {
    usedImages = []; // Reset usedImages if all images have been used
  }

  itemArr.push(new Item(id, imageNum));
};

const updateItems = (numImgs) => {
  let id = 0;
  setInterval(() => {
    createItem(numImgs, id + 1);
    console.log("item create", id);
  }, itemCreationDelay);

  const removeItem = () => {
    if (itemArr.length > 0) {
      itemArr[0].domElm.remove();
      itemArr.shift();
    }
  };

  setTimeout(() => {
    setInterval(removeItem, itemRemovalDelay);
  }, itemLifeTime); //delay removeItem after its itemLifeTime

  //check collision in very milisecond
  setInterval(() => {
    for (let i = 0; i < itemArr.length; i++) {
      if (player.isColliding(itemArr[i])) {
        if (itemArr[i].imageNum >= 1 && itemArr[i].imageNum <= 10) {
          player.score += 1;
          const displayElm = document.getElementById("score-display");
          displayElm.innerText = player.score;
          console.log(`Score: ${player.score}`);
        } else {
          //display warning
          let warningDisplay = document.getElementById("warning-display");
          if (warningDisplay.style.display === "none") {
            warningDisplay.style.display = "block";
            setTimeout(() => {
              warningDisplay.style.display = "none";
            }, 800);
          } else {
            warningDisplay.style.display = "none";
          }
        }
        // Remove the item
        itemArr[i].domElm.remove();
        itemArr.splice(i, 1);
        i--; // Decrement i so we don't skip the next item
      }
    }
  }, 1);
};

const player = new Player();
const numImgs = 21; //if there are more images for items, change the number - also can consider to change the hardcode
updateItems(numImgs);

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
