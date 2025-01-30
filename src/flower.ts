class Flower extends Entity {
  private bounceAnimationTimer: number;
  private moving: boolean; // Ska blomman röra sig?
  private direction: number; // Rörelseriktning (-1 eller 1)


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
    this.moving = random() < 0.2;
    this.direction = random() < 0.5 ? 1 : -1;
  }

  public playBounceAnimation() {
    this.bounceAnimationTimer = 300;
   images.floweranimation // gif
  }

  public update() {
    super.update();
    this.bounceAnimationTimer -= deltaTime;
    if (this.bounceAnimationTimer < 0) {
      images.flower // byt till originalbild
    }
    if (this.moving) {
      this.position.x += this.direction * sin(millis() * 0.002) * 2; 
    }
  }

  public draw() {
    super.draw();
  }
}
