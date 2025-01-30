class Flower extends Entity {
  private bounceAnimationTimer: number;

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
    this.bounceAnimationTimer = 0;
  }

  public playBounceAnimation() {
    this.bounceAnimationTimer = 300;
    // byt bild till gif
  }

  public update() {
    super.update();
    this.bounceAnimationTimer -= deltaTime;
    if (this.bounceAnimationTimer < 0) {
      // byt till originalbild
    }
  }

  public draw() {
    super.draw();
  }
}
