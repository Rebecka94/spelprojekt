class Button {
  private title: string;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private backgroundColor: string;
  private textColor: string;
  private font: string;
  private cornerRadius: number;
  private textSize: number;
  private image?: p5.Image;
  private noBorder: boolean;

  constructor(
    title: string,
    x: number,
    y: number,
    width: number,
    height: number,
    backgroundColor: string,
    textColor: string,
    font: string,
    image: p5.Image | undefined,
    cornerRadius: number,
    textSize: number,
    noBorder: boolean = false
  ) {
    this.title = title;
    this.backgroundColor = backgroundColor;
    this.width = width;
    this.height = height;
    this.textColor = textColor;
    this.font = font;
    this.textSize = textSize;
    this.cornerRadius = cornerRadius;
    this.image = image;
    this.x = x;
    this.y = y;
    this.noBorder = noBorder;
  }

  public draw() {
    push();

    if (!this.noBorder) {
      stroke("black");
      strokeWeight(5);
    } else {
      noStroke();
    }

    fill(this.backgroundColor);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height, this.cornerRadius);

    // Rita eventuell bild (om en är angiven)
    if (this.image) {
      imageMode(CENTER);
      image(this.image, this.x - this.width / 2 - 10, this.y, 60, 60);
    }

    // Rita knappens text med rätt typsnitt
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.textSize);
    textFont(this.font); // Sätt typsnittet här
    fill(this.textColor);
    text(this.title, this.x, this.y);

    pop();
  }

  private isMouseOver() {
    const offsetX = this.width * 0.5;
    const offsetY = this.height * 0.5;

    return (
      mouseX > this.x - offsetX &&
      mouseX < this.x + offsetX &&
      mouseY > this.y - offsetY &&
      mouseY < this.y + offsetY
    );
  }

  public isClicked(): boolean {
    return this.isMouseOver() && mouseIsPressed;
  }
}
