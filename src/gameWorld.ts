class GameWorld implements Scene {
  protected gameEntities: Entity[];
  private cloudImage: p5.Image;
  private score: Score;
  private cameraOffset: p5.Vector;
  private highestYReached: number;
  private nextFlowerSpawnY: number;
  private spawnInterval: number;
  private floatingTexts: FloatingText[];

  constructor() {
    this.gameEntities = [new Player(), this.createRandomEnemy()];
    this.cloudImage = images.cloud;
    const scorePosition = createVector(-100, -100);
    this.score = new Score("black", 0, 0, scorePosition, images.score);
    this.cameraOffset = createVector(0, 0);
    this.highestYReached = Infinity;
    this.spawnInterval = 400;
    this.nextFlowerSpawnY = height - 400;
    this.floatingTexts = [];
    this.initializeClouds();
    this.initializeFlowers();
    this.generateBottomPlatform();
  }

  private createRandomEnemy(): Enemy {
    const types: ("bird" | "ufo" | "plane")[] = ["bird", "ufo", "plane"];
    const randomType = random(types);
    return new Enemy(randomType);
  }

  private initializeClouds() {
    const cloudPositions: { x: number; y: number }[] = [];
    for (let i = 0; i < 5; i++) {
      let x: number, y: number;
      let validPosition = false;
      while (!validPosition) {
        x = random(0, width + 1200);
        y = random(0, height + 1000);
        validPosition = cloudPositions.every((pos) => {
          return dist(pos.x, pos.y, x, y) > 100;
        });
        if (validPosition) cloudPositions.push({ x, y });
      }
      this.gameEntities.push(new Moln(x, y, random(50, 150), random(30, 80), 0, this.cloudImage));
    }
  }

  private initializeFlowers() {
    for (let i = 0; i < 5; i++) {
      const flower = new Flower();
      flower.position = createVector(random(width * 0.3, width * 0.6), random(0, height));
      this.gameEntities.push(flower);
    }
  }

  private generateBottomPlatform() {
    const bottomFlower = new Flower();
    bottomFlower.position = createVector(width / 2, height - 50);
    this.gameEntities.push(bottomFlower);
  }

  private checkCollision() {
    for (const gameEntity of this.gameEntities) {
      if (gameEntity instanceof Player) {
        for (const otherEntity of this.gameEntities) {
          if (otherEntity instanceof Player) continue;
          if (this.entitiesCollide(gameEntity, otherEntity)) {
            if (otherEntity instanceof Flower) {
              gameEntity.jump();
            } else if (otherEntity instanceof Honey) {
              otherEntity.applyEffect(this.score);
              this.gameEntities = this.gameEntities.filter(e => e !== otherEntity);

              // Create a floating text effect
              const textPosition = createVector(otherEntity.position.x, otherEntity.position.y - 30);
              this.floatingTexts.push(new FloatingText("+20", textPosition));
            } else if (otherEntity instanceof Enemy) {
              game.changeScene("gameover");
            }
          }
        }
      }
    }
  }

  private entitiesCollide(o1: Entity, o2: Entity): boolean {
    return dist(o1.hitBoxPos.x, o1.hitBoxPos.y, o2.hitBoxPos.x, o2.hitBoxPos.y) <= o1.hitBoxRadius + o2.hitBoxRadius;
  }

  private checkPlayerFall() {
    const player = this.gameEntities.find(e => e instanceof Player);
    if (player && player.position.y > height) game.changeScene("gameover");
  }

  private spawnFlowersAbovePlayer(playerY: number) {
    for (let i = 0; i < 2; i++) {
      const flower = new Flower();
      flower.position = createVector(random(width * 0.3, width * 0.7), playerY - random(500, 1000));
      this.gameEntities.push(flower);
    }
  }

  private createRandomHoney(): Honey {
    return new Honey(random(width * 0.3, width * 0.7), this.highestYReached - random(500, 1200));
  }

  public update() {
    for (const entity of this.gameEntities) {
      entity.update();
    }

    const player = this.gameEntities.find(e => e instanceof Player) as Player;
    if (player) {
      this.cameraOffset.x = 0;
      this.cameraOffset.y = height * 0.7 - (player.position.y + player.size.y / 2);
      if (player.position.y < this.highestYReached) {
        this.highestYReached = player.position.y;
        this.score.update();
      }
      if (player.position.y < this.nextFlowerSpawnY) {
        this.spawnFlowersAbovePlayer(player.position.y);
        this.nextFlowerSpawnY -= this.spawnInterval;
      }
    }
    this.checkPlayerFall();
    this.checkCollision();
    this.createRandomHoney(); 

    // Update floating texts
    this.floatingTexts.forEach(text => text.update());
    this.floatingTexts = this.floatingTexts.filter(text => !text.isExpired());
  }

  public draw(): void {
    background("#2a9ec7");
    push();
    translate(this.cameraOffset.x, this.cameraOffset.y);
  
    // Draw game entities
    for (const entity of this.gameEntities) entity.draw();
  
    pop(); // Ensure text is not affected by camera translation
  
    // Draw floating texts correctly, without being affected by the camera offset
    this.floatingTexts.forEach(text => {
      // Apply camera offset to floating text position
      push();
      translate(this.cameraOffset.x, this.cameraOffset.y);
      text.draw();
      pop();
    });
  
    // Draw the score (outside of camera transform)
    this.score.draw();
  
    // Ensure honey is added at correct intervals
    if (random(1) < 0.005) {
      this.gameEntities.push(this.createRandomHoney());
    }
  }
}