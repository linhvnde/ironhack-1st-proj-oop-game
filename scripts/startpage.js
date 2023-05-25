class Player {
  constructor() {
    this.score = 0;
    this.domElm = null;
    this.height = 40;
    this.width = 25;
    this.positionX = 10;
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
  }
}
const player = new Player();
window.addEventListener("load", (event) => {
  let openingAudio = new Audio("./sounds/opening.mp3");
  openingAudio.loop = true;
  openingAudio.volume = 0.5;
  openingAudio.play();
});
