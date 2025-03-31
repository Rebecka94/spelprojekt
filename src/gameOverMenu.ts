/// <reference path="scene.ts" />
class GameOverMenu implements Scene {
  private repeatImage: p5.Image;
  private exitImage: p5.Image;
  private repeatButton: Button;
  private exitButton: Button;

  constructor() {
    this.repeatImage = images.repeatImage;
    this.exitImage = images.exitImage;

    this.repeatButton = new Button(
      "Repeat",
      width * 0.41 + 50,
      height * 0.54,
      180,
      60,
      "",
      "black",
      "Alfa Slab One",
      this.repeatImage,
      0,
      30,
      true
    );

    this.exitButton = new Button(
      "Exit",
      width * 0.57 + 50,
      height * 0.54,
      140,
      60,
      "",
      "black",
      "Alfa Slab One",
      this.exitImage,
      0,
      30,
      true
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
    this.drawTransparent(width * 0.5, height * 0.5, 900, 500, 250);
    this.drawGameOverText();
    this.drawButtons();
    pop()
  }

  private drawTransparent( 
    rectX: number,
    rectY: number,
    rectWidth: number,
    rectHeight: number,
    cornerRadius: number
  ) {
    push(); // Spara tidigare ritinställningar
    noStroke();
    fill(255, 255, 255, 180);
    rectMode(CENTER);
    rect(rectX, rectY, rectWidth, rectHeight, cornerRadius);
    pop(); // Återställ tidigare ritinställningar
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
