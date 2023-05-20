console.log("connected");
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
const player = new Player();

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
