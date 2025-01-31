/// <reference path="entity.ts" />

class Moln extends Entity {
  private darknessFactor: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    velocityX: number,
    image: p5.Image
  ) {
    super(x, y, width, height, velocityX, 0, image);
    this.darknessFactor = 1;
  }
  public setDarkness(darkness: number) {
    this.darknessFactor = constrain(darkness, 0, 1); // Begränsar värdet till mellan 0 och 1
    console.log("Molnets mörkerfaktor:", this.darknessFactor); // Lägg till logg för felsökning
  }

  public draw() {
    push();
    tint(255 * this.darknessFactor); // Justerar molnets ljusstyrka
    image(
      this.image,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
    pop();
  }
}
