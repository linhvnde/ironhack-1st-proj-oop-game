// console.log("connected");
let floorY = 44;
let reachablePoint = 75;
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
    if (this.positionY < floorY) {
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

class GameObj {
  constructor(type, id, imageNum, height, width, positionX, positionY) {
    this.type = type;
    this.imageNum = imageNum;
    this.domElm = null;
    this.height = height; //15;
    this.width = width; //10;
    this.positionX = positionX; // Math.floor(Math.random() * (100 - this.width));
    this.positionY = positionY; //Math.floor(Math.random() * (reachablePoint - this.height));
    this.createDomElm(type, id, imageNum);
  }
  createDomElm(type, id, imageNum) {
    this.domElm = document.createElement("div");
    this.domElm.id = `${type}` + id;
    this.domElm.classList.add(type);
    this.domElm.style.backgroundImage = `url(../imgs/${type}${imageNum}.png)`; //dynamically change the images
    this.domElm.style.height = this.height + "vh";
    this.domElm.style.width = this.width + "vw";
    this.domElm.style.left = this.positionX + "vw";
    this.domElm.style.bottom = this.positionY + "vh";
    const board = document.getElementById("board");
    board.appendChild(this.domElm);
    // console.log("new item", this.domElm.style);
  }
}
class Item extends GameObj {
  constructor(id, imageNum) {
    let positionX = Math.floor(Math.random() * (100 - 10));
    let positionY = Math.floor(Math.random() * (reachablePoint - 15));
    super("item", id, imageNum, 15, 10, positionX, positionY);
  }
}
class Obstacle extends GameObj {
  constructor(id, imageNum) {
    let positionX = Math.floor(Math.random() * (100 - 5));
    super("obs", id, imageNum, 5, 5, positionX, 100 - 5);
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.newPos();
    this.move();
  }
  move() {
    setInterval(() => {
      this.newPos();
    }, 25);
  }
  newPos() {
    if (this.positionY < 0) {
      clearInterval(this.move);
      this.domElm.remove();
    } else {
      this.gravitySpeed += this.gravity;
      this.positionX += this.speedX;
      this.positionY -= this.speedY + this.gravitySpeed;
      this.domElm.style.left = this.positionX + "vw";
      this.domElm.style.bottom = this.positionY + "vh";
    }
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
//create items
const updateItems = (numImgs) => {
  let id = 0;
  setInterval(() => {
    createItem(numImgs, id + 1);
    console.log("item create", id);
  }, itemCreationDelay);
  //remove items
  const removeItem = () => {
    if (itemArr.length > 0) {
      itemArr[0].domElm.remove();
      itemArr.shift();
    }
  };

  setTimeout(() => {
    setInterval(removeItem, itemRemovalDelay);
  }, itemLifeTime); //delay removeItem after its itemLifeTime
};
// Initialization of player and item images
const player = new Player();
const numImgs = 21; //if there are more images for items, change the number - also can consider to change the hardcode
updateItems(numImgs);

////create obstacles & randomly set image to obstacles
let obstacleArr = [];
const obstacleCreationDelay = 1000;
//create obstacles
const createObstacle = (numImgs, id) => {
  let imageNum = Math.floor(Math.random() * numImgs) + 1;
  obstacleArr.push(new Obstacle(id, imageNum));
};
//update obstacles
const updateObstacles = (numImgs) => {
  let id = 0;
  setInterval(() => {
    createObstacle(numImgs, id + 1);
    console.log("obstacle create", id);
  }, obstacleCreationDelay);
};

const numObstacleImgs = 8;
updateObstacles(numObstacleImgs);

const gameOver = () => {
  location.href = "./gameover.html";
};

//check collision in very milisecond
setInterval(() => {
  //item collisions actions
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
  //obstacle collisions actions
  for (let i = 0; i < obstacleArr.length; i++) {
    if (player.isColliding(obstacleArr[i])) {
      gameOver();
      return;
    }
  }
}, 1);

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
