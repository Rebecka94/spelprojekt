class GameWorld implements Scene {
  protected gameEntities: Entity[];
  private cloudImage: p5.Image;
  private score: Score;
  private cameraOffset: p5.Vector;
  private highestYReached: number;
  private nextFlowerSpawnY: number;
  private spawnInterval: number;
  private floatingTexts: FloatingText[];
  private lastFlowerPosition: p5.Vector;

  private skyColors: p5.Color[];
  private transitionDuration: number;
  private startTime: number;

  private clouds: Moln[];

  private honeySpawnInterval: number; // Time between spawning honey
  private lastHoneySpawnTime: number;
  private lastEnemySpawnTime: number; // Time of last enemy spawn

  constructor() {
    // Basic setup
    this.gameEntities = [new Player(), this.createRandomEnemy()];
    this.cloudImage = images.cloud;
    const scorePosition = createVector(-100, -100);
    
    this.score = new Score(
    "black",         
    0,              
    0,            
    scorePosition, 
    images.sun,  
    images.moon
    );

    this.cameraOffset = createVector(0, 0);
    this.highestYReached = Infinity;
    this.spawnInterval = 400;
    this.nextFlowerSpawnY = height - 400;
    this.lastFlowerPosition = createVector(width * 0.5, height * 0.95);
    this.floatingTexts = [];
    this.clouds = [];

    // Honey spawn info
    this.honeySpawnInterval = 5000; 
    this.lastHoneySpawnTime = millis();

    // Enemy spawn info
    this.lastEnemySpawnTime = 0; // Keep track when to spawn next

    // Initial functions
    this.initializeClouds();
    this.initializeFlowers();
    this.generateBottomPlatform();

    // Sky color transitions
    this.skyColors = [color("#2a9ec7"), color("#1f6b91"), color("#2d2f3b")];
    this.transitionDuration = 30000;
    this.startTime = millis();
  }

  private createRandomEnemy(): Enemy {
    const types: ("bird" | "ufo" | "plane")[] = ["bird", "ufo", "plane"];
    const randomType = random(types);
    return new Enemy(randomType);
  }

  private initializeClouds() {
    const cloudCount = 5;
    const minDistance = 400;
    const maxAttempts = 700;

    for (let i = 0; i < cloudCount; i++) {
      let attempts = 0;
      let validPosition = false;
      let x: number = 0;
      let y: number = 0;

      while (!validPosition && attempts < maxAttempts) {
        x = random(50, width - 50);
        y = random(50, height - 50);

        validPosition = this.clouds.every(cloud => {
          const distance = dist(x, y, cloud.position.x, cloud.position.y);
          return distance > minDistance;
        });

        attempts++;
      }

      if (validPosition) {
        const cloudWidth = random(80, 200);
        const cloudHeight = random(50, 100);
        const cloud = new Moln(x, y, cloudWidth, cloudHeight, 0, this.cloudImage);
        this.clouds.push(cloud);
        console.log(`Moln ${i + 1} skapades på (${x}, ${y}).`);
      } else {
        console.warn(`Moln ${i + 1} kunde inte placeras efter ${maxAttempts} försök.`);
      }
    }
    console.log(`Totalt ${this.clouds.length} moln skapades.`);
  }

  private initializeFlowers() {
    for (let i = 0; i < 7; i++) {
      const flower = new Flower();
      flower.position = createVector(
        random(width * 0.2, width * 0.7),
        this.lastFlowerPosition.y - random(200, 500)
      );
      this.lastFlowerPosition = flower.position;
      this.gameEntities.push(flower);
    }
  }

  private generateBottomPlatform() {
    const bottomFlower = new Flower();
    bottomFlower.position = createVector(width / 2, height - 50);
    bottomFlower.moving = false;
    this.gameEntities.push(bottomFlower);
  }

  private checkCollision() {
    for (const gameEntity of this.gameEntities) {
      if (gameEntity instanceof Player) {
        for (const otherEntity of this.gameEntities) {
          if (otherEntity instanceof Player) continue;
          if (this.entitiesCollide(gameEntity, otherEntity)) {
            if (otherEntity instanceof Flower) {
              // Bounce off a flower
              gameEntity.jump();
              otherEntity.playBounceAnimation();
            } else if (otherEntity instanceof Honey) {
              // Honey effect
              otherEntity.applyEffect(this.score);
              this.gameEntities = this.gameEntities.filter((e) => e !== otherEntity);

              // Floating text
              const textPosition = createVector(
                otherEntity.position.x,
                otherEntity.position.y - 30
              );
              this.floatingTexts.push(new FloatingText("+20", textPosition));
            } else if (otherEntity instanceof Enemy) {
              // Collide with enemy => Game Over
              game.changeScene("gameover");
            }
          }
        }
      }
    }
  }

  private entitiesCollide(o1: Entity, o2: Entity): boolean {
    return (
      dist(o1.hitBoxPos.x, o1.hitBoxPos.y, o2.hitBoxPos.x, o2.hitBoxPos.y) <=
      o1.hitBoxRadius + o2.hitBoxRadius
    );
  }

  private checkPlayerFall() {
    const player = this.gameEntities.find((e) => e instanceof Player);
    if (!player) return;

    // If player's y > screen height => game over
    if (player.position.y > height) {
      game.changeScene("gameover");
      return;
    }

    // If the player has fallen 1000 px below highest reached point => game over
    if (player.position.y - this.highestYReached >= 1000) {
      game.changeScene("gameover");
    }
  }

  private spawnFlowersAbovePlayer() {
    for (let i = 0; i < 2; i++) {
      const flower = new Flower();
      flower.position = createVector(
        random(width * 0.3, width * 0.7),
        this.lastFlowerPosition.y - random(200, 500)
      );
      this.lastFlowerPosition = flower.position;
      this.gameEntities.push(flower);
    }
  }

  /** 
   * Returns a newly-created Honey (if conditions are met), otherwise null.
   */
  private createRandomHoney(): Honey | null {
    const now = millis();
    if (now - this.lastHoneySpawnTime > this.honeySpawnInterval) {
      const honeyCount = this.gameEntities.filter((entity) => entity instanceof Honey).length;
      const maxHoney = 3; // Max 3 honey objects at once

      if (honeyCount < maxHoney) {
        const honey = new Honey(
          random(width * 0.3, width * 0.7),
          this.highestYReached - random(500, 1000)
        );
        this.lastHoneySpawnTime = now;
        return honey;
      }
    }
    return null;
  }

  public update() {
    // Update all entities
    for (const entity of this.gameEntities) {
      entity.update();
    }

    // Update clouds if needed
    for (const cloud of this.clouds) {
      cloud.update();
    }

    const player = this.gameEntities.find((e) => e instanceof Player) as Player;
    if (player) {
      // Camera offset for "scrolling"
      this.cameraOffset.x = 0;
      this.cameraOffset.y = height * 0.7 - (player.position.y + player.size.y / 2);

      // Track highest point
      if (player.position.y < this.highestYReached) {
        this.highestYReached = player.position.y;
        this.score.update();
      }

      // Spawn new flowers based on player's Y
      if (player.position.y < this.nextFlowerSpawnY) {
        this.spawnFlowersAbovePlayer();
        this.nextFlowerSpawnY -= this.spawnInterval;
      }

      // Check if it's time to spawn a new enemy
      const now = millis();
      if (now - this.lastEnemySpawnTime >= 5000) {
        const newEnemy = this.createRandomEnemy();
        // Position the enemy off-screen to the left or right
        newEnemy.position.x = -300;
        // Place enemy some distance above the player
        newEnemy.position.y = player.position.y - 2000;
        this.gameEntities.push(newEnemy);
        this.lastEnemySpawnTime = now;
      }
    }

    // Check for collisions and falling
    this.checkPlayerFall();
    this.checkCollision();

    // Occasionally spawn honey
    if (random(1) < 0.005) {
      const newHoney = this.createRandomHoney();
      if (newHoney) {
        this.gameEntities.push(newHoney);
      }
    }

    // Update floating texts and remove expired ones
    this.floatingTexts.forEach((text) => text.update());
    this.floatingTexts = this.floatingTexts.filter((text) => !text.isExpired());
  }

  public draw(): void {
    // Background color transition
    const elapsedTime = millis() - this.startTime;
    const phase = floor(elapsedTime / this.transitionDuration);
    const t = (elapsedTime % this.transitionDuration) / this.transitionDuration;

    let currentColor: p5.Color;
    if (phase < this.skyColors.length - 1) {
      currentColor = lerpColor(this.skyColors[phase], this.skyColors[phase + 1], t);
    } else {
      currentColor = this.skyColors[this.skyColors.length - 1];
    }

    background(currentColor);

    // Calculate brightness for clouds
    const backgroundBrightness =
      red(currentColor) * 0.299 +
      green(currentColor) * 0.587 +
      blue(currentColor) * 0.114;

      this.score.updateImage(backgroundBrightness);

    const maxBrightness = Math.max(
      ...this.skyColors.map((c) => red(c) * 0.299 + green(c) * 0.587 + blue(c) * 0.114)
    );
    const minBrightness = Math.min(
      ...this.skyColors.map((c) => red(c) * 0.299 + green(c) * 0.587 + blue(c) * 0.114)
    );

    const cloudDarkness = map(backgroundBrightness, minBrightness, maxBrightness, 0.3, 1);
    console.log("Background Brightness:", backgroundBrightness, "Cloud Darkness:", cloudDarkness);

    // Draw clouds with appropriate darkness
    for (const cloud of this.clouds) {
      cloud.setDarkness(cloudDarkness);
      cloud.draw();
    }

    // Apply camera transformation
    push();
    translate(this.cameraOffset.x, this.cameraOffset.y);

    // Draw flowers
    for (const entity of this.gameEntities) {
      if (entity instanceof Flower) {
        entity.draw();
      }
    }

    // Draw honey
    for (const entity of this.gameEntities) {
      if (entity instanceof Honey) {
        entity.draw();
      }
    }

    // Draw enemies
    for (const entity of this.gameEntities) {
      if (entity instanceof Enemy) {
        entity.draw();
      }
    }

    // Draw the player last
    const player = this.gameEntities.find((e) => e instanceof Player);
    if (player) {
      player.draw();
    }

    pop(); // end camera transform

    // Draw floating texts (translated so they follow camera)
    this.floatingTexts.forEach((text) => {
      push();
      translate(this.cameraOffset.x, this.cameraOffset.y);
      text.draw();
      pop();
    });

    // Draw score on top
    this.score.draw();
  }
}
