class StartMenu implements Scene {
  private bgImage: p5.Image;
  private arrowImage: p5.Image;
  private title: string;
  private playButton: Button;
  private changeSceneCallback: () => void;

  constructor(changeSceneCallback: () => void) {
    this.bgImage = images.backgroundImage;
    this.arrowImage = images.arrowImage;
    this.title = "Bee Rise";
    this.changeSceneCallback = changeSceneCallback;

    this.playButton = new Button(
      "Play",
      width * 0.5,
      height * 0.5,
      200,
      85,
      "#d20007",
      "#fff",
      "Alfa Slab One",
      undefined,
      50,
      40
    );
  }

  private drawTitle() {
    push();
    textFont("Bee Rise");
    textAlign(CENTER, CENTER);
    textSize(150);
    fill("#ffca00");
    textFont("Modak");
    stroke(0);
    strokeWeight(8);
    text(this.title, width / 2, height / 4);
    pop();
  }

  private drawInstructions() {
    const rectX = width * 0.5;
    const rectY = height * 0.8;
    const rectWidth = 500;
    const rectHeight = 250;
    const cornerRadius = 400;

    push();
    // Draw transparent background
    fill(255, 255, 255, 120); // Semi-transparent white
    noStroke();
    rectMode(CENTER);
    rect(rectX, rectY, rectWidth, rectHeight, cornerRadius);

    // Draw "Instruction" text
    textFont("Alfa Slab One");
    textSize(32);
    textAlign(CENTER, CENTER);
    fill("#000");
    text("Instruction", rectX, rectY - 70);

    // Draw arrow keys
    const arrowKeySize = 60;
    const arrowKeyX = rectX - 40;
    const arrowKeyY = rectY - 20;
    image(
      this.arrowImage,
      arrowKeyX - arrowKeySize / 2,
      arrowKeyY - 20,
      130,
      130
    );

    textSize(18);
    text("Go left", rectX - 120, rectY + 50);
    text("Go right", rectX + 120, rectY + 50);
    pop();
  }

  public update(): void {
    if (this.playButton.isClicked()) {
      this.changeSceneCallback();
    }
  }

  public draw(): void {
    image(this.bgImage, 0, 0, width, height);
    this.drawTitle();
    this.playButton.draw();
    this.drawInstructions();
  }
}
