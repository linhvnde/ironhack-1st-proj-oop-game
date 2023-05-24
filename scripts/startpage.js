class Player {
  constructor() {
    this.score = 0;
    this.domElm = null;
    this.height = 40;
    this.width = 25;
    this.positionX = 17;
    this.positionY = 36;
    this.createDomElm();
  }
  createDomElm() {
    this.domElm = document.createElement("div");
    this.domElm.id = "player";
    this.domElm.style.backgroundImage = "url(./imgs/playergamestart.png)";
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
const player = new Player();
window.addEventListener("load", (event) => {
  let openingAudio = new Audio("./sounds/opening.mp3");
  openingAudio.loop = true;
  openingAudio.volume = 0.5;
  openingAudio.play();
});
