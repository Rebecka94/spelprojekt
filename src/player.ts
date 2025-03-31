class Player extends Entity {
  private jumpStrength: number = 8;
  private gravity: number = 0.1;
  private groundLevel: number;
  private powerUpActive: boolean = false;
  private powerUpDuration: number = 300;
  private powerUpTimer: number = 0;

  constructor() {
    super(width * 0.5, height - 120, 100, 140, 0, 0, images.player);
    this.groundLevel = height - 120;
  }

  public update() {
    super.update();

    if (keyIsDown(LEFT_ARROW)) {
      this.velocity.x = this.powerUpActive ? -8 : -5; // Increase speed when powered up
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.velocity.x = this.powerUpActive ? 8 : 5;
    } else {
      this.velocity.x = 0;
    }

    this.velocity.y += this.gravity;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.x < 0) {
      this.position.x = 0;
    } else if (this.position.x + this.size.x > width) {
      this.position.x = width - this.size.x;
    }

    if (this.position.y >= this.groundLevel && this.velocity.y <= 0) {
      this.position.y = this.groundLevel;
      this.velocity.y = -this.jumpStrength;
    }

    // Handle power-up duration
    if (this.powerUpActive) {
      this.powerUpTimer--;
      if (this.powerUpTimer <= 0) {
        this.powerUpActive = false;
      }
    }
  }

  public jump() {
    this.velocity.y = -this.jumpStrength;

    if (this.velocity.y) {
      music.jumpSound.play();
    }
  }

  public activatePowerUp() {
    this.powerUpActive = true;
    this.powerUpTimer = this.powerUpDuration;
  }
}