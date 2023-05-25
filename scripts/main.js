let isGameOver = false;
let floorY = 44;
let reachablePoint = 75;
let openingAudio = new Audio("./sounds/gameplay.mp3");
openingAudio.preload = "auto";
let gameOverAudio = new Audio("./sounds/gameover.wav");
gameOverAudio.preload = "auto";
//
//
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
    this.domElm.style.backgroundImage = "url(./imgs/player.png)";
    this.domElm.style.height = this.height + "vh";
    this.domElm.style.width = this.width + "vw";
    this.domElm.style.left = this.positionX + "vw";
    this.domElm.style.bottom = this.positionY + "vh";
    const board = document.getElementById("board");
    board.appendChild(this.domElm);
  }
  moveUp() {
    if (this.positionY < floorY) {
      this.positionY++;
      this.domElm.style.bottom = this.positionY + "vh";
    } else {
      return;
    }
  }
  moveDown() {
    if (this.positionY <= 0) {
      return;
    } else {
      this.positionY--;
      this.domElm.style.bottom = this.positionY + "vh";
    }
  }
  moveLeft() {
    if (this.positionX <= 0) {
      return;
    } else {
      this.positionX--;
      this.domElm.style.left = this.positionX + "vw";
    }
  }
  moveRight() {
    if (this.positionX < 100 - this.width) {
      this.positionX++;
      this.domElm.style.left = this.positionX + "vw";
    } else {
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
//
//
//GameObj
class GameObj {
  constructor(type, id, imageNum, height, width, positionX, positionY) {
    this.type = type;
    this.imageNum = imageNum;
    this.domElm = null;
    this.height = height;
    this.width = width;
    this.positionX = positionX;
    this.positionY = positionY;
    this.createDomElm(type, id, imageNum);
  }
  createDomElm(type, id, imageNum) {
    this.domElm = document.createElement("div");
    this.domElm.id = `${type}` + id;
    this.domElm.classList.add(type);
    this.domElm.style.backgroundImage = `url(./imgs/${type}${imageNum}.png)`; //dynamically change the images
    this.domElm.style.height = this.height + "vh";
    this.domElm.style.width = this.width + "vw";
    this.domElm.style.left = this.positionX + "vw";
    this.domElm.style.bottom = this.positionY + "vh";
    const board = document.getElementById("board");
    board.appendChild(this.domElm);
  }
}
//
//
//collectible items
class Item extends GameObj {
  constructor(id, imageNum) {
    let positionX = Math.floor(Math.random() * (100 - 10));
    let positionY = Math.floor(Math.random() * (reachablePoint - 15));
    super("item", id, imageNum, 15, 10, positionX, positionY);
  }
}
//
//
//obstacles
class Obstacle extends GameObj {
  constructor(id, imageNum) {
    let positionX = Math.floor(Math.random() * (100 - 7));
    super("obs", id, imageNum, 7, 7, positionX, 100);
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.newPos();
    this.move();
  }
  move() {
    const obstacleMovementIntervalId = setInterval(() => {
      if (isGameOver) {
        clearInterval(obstacleMovementIntervalId);
        return;
      }
      this.newPos();
    }, 35);
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
//
//
//game start
//
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
  //create items
  const itemCreationIntervalId = setInterval(() => {
    if (isGameOver) {
      clearInterval(itemCreationIntervalId);
      return;
    }
    createItem(numImgs, id + 1);
  }, itemCreationDelay);
  //remove items
  const removeItem = () => {
    if (itemArr.length > 0) {
      itemArr[0].domElm.remove();
      itemArr.shift();
    }
  };
  setTimeout(() => {
    const itemRemovalIntervalId = setInterval(() => {
      if (isGameOver) {
        clearInterval(itemRemovalIntervalId);
        return;
      }
      removeItem();
    }, itemRemovalDelay);
  }, itemLifeTime); //delay removeItem after its itemLifeTime
};
//
//
// Initialization of player and item images
const player = new Player();
const numImgs = 21; //if there are more images for items, change the number - also can consider to change the hardcode
updateItems(numImgs);
//
//create obstacles & randomly set image to obstacles
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
  const obstacleCreationIntervalId = setInterval(() => {
    if (isGameOver) {
      clearInterval(obstacleCreationIntervalId);
      return;
    }
    createObstacle(numImgs, id + 1);
  }, obstacleCreationDelay);
};
//
//obstacle images - if there are more images for obstacles, change the number
const numObstacleImgs = 8;
updateObstacles(numObstacleImgs);

const gameOver = () => {
  isGameOver = true;
  openingAudio.pause();
  gameOverAudio.play();
  gameOverAudio.volume = 0.2;
  gameOverAudio.onended = function () {
    location.href = "./gameover.html";
  };
};
//
//check collision in every milisecond
const collisionIntervalId = setInterval(() => {
  if (isGameOver) {
    clearInterval(collisionIntervalId);
  }
  //item collisions actions
  for (let i = 0; i < itemArr.length; i++) {
    if (player.isColliding(itemArr[i])) {
      //collide with collectible items
      if (itemArr[i].imageNum >= 1 && itemArr[i].imageNum <= 10) {
        let winningAudio = new Audio("./sounds/itemcollected.wav");
        winningAudio.play();
        player.score += 1;
        const displayElm = document.getElementById("score-display");
        displayElm.innerText = player.score;
        console.log(`Score: ${player.score}`);
      } else {
        //collide with wrong items
        //display warning
        let losingAudio = new Audio("./sounds/wrongitem.mp3");
        losingAudio.volume = 0.5;
        losingAudio.play();
        let warningDisplay = document.getElementById("warning-display");
        warningDisplay.style.display = "block";
        setTimeout(() => {
          warningDisplay.style.display = "none";
        }, 500);
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
//
//
//attach event listener
//play music
window.addEventListener("load", (event) => {
  openingAudio.loop = true;
  openingAudio.volume = 0.3;
  openingAudio.play();
});
//gameplay
document.addEventListener("keydown", (event) => {
  if (isGameOver) {
    return;
  }
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
