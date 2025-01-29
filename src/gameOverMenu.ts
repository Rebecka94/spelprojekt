/// <reference path="scene.ts" />
class GameOverMenu implements Scene {
  private repeatImage: p5.Image;
  private exitImage: p5.Image;
  private repeatButton: Button;
  private exitButton: Button;
  private rectX: number;
  private rectY: number;
  private rectWidth: number;
  private rectHeight: number;
  private cornerRadius: number;

  constructor() {
    this.repeatImage = images.repeatImage;
    this.exitImage = images.exitImage;
    this.rectX = width * 0.5;
    this.rectY = height * 0.5;
    this.rectWidth = 900;
    this.rectHeight = 500;
    this.cornerRadius = 250;

    this.repeatButton = new Button(
      "Repeat",
      width * 0.4 + 50,
      height * 0.54,
      180,
      60,
      "#d20007",
      "black",
      "Alfa Slab One",
      0,
      this.repeatImage,
      0
    );

    this.exitButton = new Button(
      "Exit",
      width * 0.6 + 50,
      height * 0.54,
      180,
      60,
      "#d20007",
      "black",
      "Alfa Slab One",
      40,
      this.exitImage,
      0,
    );
  }

  public update() {
    if (this.repeatButton.isClicked()) {
      game.resetGame();
      game.changeScene("game");
    }
    if (this.exitButton.isClicked()) {
      game.resetGame();
      game.changeScene("start");
    }
  }

  public draw() {
    push()
    this.drawTransparent();
    this.drawGameOverText();
    this.drawButtons();
    pop()
  }

  private drawTransparent() {
    fill(255, 255, 255, 120);
    noStroke();
    rectMode(CENTER);
    rect(
      this.rectX,
      this.rectY,
      this.rectWidth,
      this.rectHeight,
      this.cornerRadius
    );
  }
  private drawGameOverText() {
    textFont("Modak");
    textSize(72);
    fill("#d20007");
    stroke(0);
    strokeWeight(8);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height * 0.35);
  }

  private drawButtons() {
    this.repeatButton.draw();
    this.exitButton.draw();
  }
}
