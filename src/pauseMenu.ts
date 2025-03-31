class PauseMenu implements Scene {
  private continueImage: p5.Image;
  private exitImage: p5.Image;
  private continueButton: Button;
  private exitButton: Button;

  constructor() {
    this.continueImage = images.continueImage;
    this.exitImage = images.exitImage;

    this.continueButton = new Button(
      "Continue",
      width * 0.5 + 50,
      height * 0.43,
      180,
      60,
      "#d20007",
      "black",
      "Alfa Slab One",
      this.continueImage,
      0,
      0
    );

    this.exitButton = new Button(
      "Exit",
      width * 0.5 + 50,
      height * 0.54,
      180,
      60,
      "#d20007",
      "black",
      "Alfa Slab One",
      this.exitImage,
      0,
      40
    );
  }

  public update() {
    if (this.continueButton.isClicked()) {
      // Change to scene A
    }
    if (this.exitButton.isClicked()) {
      // Change to scene B
    }
  }

  public draw() {
    // Draw transparent rectangle background
    this.drawTransparent(width * 0.5, height * 0.5, 900, 500, 250);

    // Draw buttons and icons
    this.drawButtons();
  }

  private drawTransparent(
    rectX: number,
    rectY: number,
    rectWidth: number,
    rectHeight: number,
    cornerRadius: number
  ) {
    fill(255, 255, 255, 120); // Semi-transparent white
    noStroke();
    rectMode(CENTER);
    rect(rectX, rectY, rectWidth, rectHeight, cornerRadius);
  }

  private drawButtons() {
    this.continueButton.draw();
    this.exitButton.draw();
  }
}
