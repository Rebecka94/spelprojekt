/// <reference path="entity.ts" />

class Player extends Entity {
  private jumpStrength: number = 10;
  private gravity: number = 0.2;
  private groundLevel: number;
 

  constructor() {
    super(width * 0.5, height - 120, 100, 140, 0, 0, images.player);
    this.groundLevel = height - 120;
  }

  public update() {
    super.update();

    if (keyIsDown(LEFT_ARROW)) {
      this.velocity.x = -5;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.velocity.x = 5;
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
  }

  public jump() {
    this.velocity.y = -this.jumpStrength;
    
    if (this.velocity.y) {
      music.jumpSound.play();
    }
  }
}
