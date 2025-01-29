class Flower extends Entity {

  constructor() {
    super(
      random(0, width - 120),
      random(0, height - 100),
      170,
      100,
      0,
      0,
      images.flower
    );
  }

  public draw() {
    super.draw();
  }
}
