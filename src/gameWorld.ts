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

  constructor() {
    this.gameEntities = [new Player(), this.createRandomEnemy()];
    this.cloudImage = images.cloud;
    const scorePosition = createVector(-100, -100);
    this.score = new Score("black", 0, 0, scorePosition, images.score);
    this.cameraOffset = createVector(0, 0);
    this.highestYReached = Infinity;
    this.spawnInterval = 400;
    this.nextFlowerSpawnY = height - 400;
    this.lastFlowerPosition = createVector(width * 0.5, height * 0.95);
    this.floatingTexts = [];
    this.initializeClouds();
    this.initializeFlowers();
    this.generateBottomPlatform();

      // Skapa en ny fiende var tredje sekund
    setInterval(() => {
      const newEnemy = this.createRandomEnemy();
      this.gameEntities.push(newEnemy);
    }, 3000); // 5000 ms = 5 sekunder
    
  this.skyColors = [color("#2a9ec7"), color("#1f6b91"), color("#2d2f3b")];
    this.transitionDuration = 30000; // övergång tid sekunder
    this.startTime = millis(); // Starttid för färgövergång
  }

private createRandomEnemy(): Enemy {
    if (!this.score) {
        console.error("ERROR: Score objektet är undefined!");
        return new Enemy("bird"); // Default så spelet inte kraschar
    }

    let enemyType: "bird" | "ufo" | "plane";

    if (this.score.currentScore <= 500) {
        enemyType = "bird";
    } else if (this.score.currentScore <= 1000) {
        enemyType = "plane";
    } else if (this.score.currentScore <= 1500) {
        enemyType = "ufo";
    } else {
        enemyType = "bird"; // Om poängen skulle vara för hög, fall tillbaka till bird
    }

    console.log(`🛠 Spawning enemy type: ${enemyType} at score: ${this.score.currentScore}`);
    return new Enemy(enemyType);
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
      this.gameEntities.push(
        new Moln(x, y, random(50, 150), random(30, 80), 0, this.cloudImage)
      );
    }
  }

  private initializeFlowers() {
    for (let i = 0; i < 5; i++) {
      const flower = new Flower();
      flower.position = createVector(
        random(width * 0.3, width * 0.6),
        this.lastFlowerPosition.y - random(200, 500)
      );
      this.lastFlowerPosition = flower.position;
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
              this.gameEntities = this.gameEntities.filter(
                (e) => e !== otherEntity
              );

              // Create a floating text effect
              const textPosition = createVector(
                otherEntity.position.x,
                otherEntity.position.y - 30
              );
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
    return (
      dist(o1.hitBoxPos.x, o1.hitBoxPos.y, o2.hitBoxPos.x, o2.hitBoxPos.y) <=
      o1.hitBoxRadius + o2.hitBoxRadius
    );
  }

  private checkPlayerFall() {
    const player = this.gameEntities.find((e) => e instanceof Player);
    if (player && player.position.y > height) game.changeScene("gameover");
  }

  // private removeOffscreenEnemies() {
  //   this.gameEntities = this.gameEntities.filter(entity => {
  //     if (entity instanceof Enemy) {
  //       const isOffscreen =
  //         entity.position.x + entity.size.x < 0 ||
  //         entity.position.x > width ||
  //         entity.position.y + entity.size.y < 0 ||
  //         entity.position.y > height;

  //       return !isOffscreen;
  //     }
  //     return true;
  //   });
  // }

  // ADDED: Helper method to spawn additional flowers above the player.
  private spawnFlowersAbovePlayer(playerY: number) {
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

  private createRandomHoney(): Honey {
    return new Honey(
      random(width * 0.3, width * 0.7),
      this.highestYReached - random(500, 1200)
    );
  }

  public update() {
    for (const entity of this.gameEntities) {
      entity.update();
    }
    // Remove enemies that has left game area
    // this.removeOffscreenEnemies();
    // Find the player
    const player = this.gameEntities.find(e => e instanceof Player) as Player;

    const player = this.gameEntities.find((e) => e instanceof Player) as Player;
    if (player) {
      this.cameraOffset.x = 0;
      this.cameraOffset.y =
        height * 0.7 - (player.position.y + player.size.y / 2);
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
    this.floatingTexts.forEach((text) => text.update());
    this.floatingTexts = this.floatingTexts.filter((text) => !text.isExpired());
  }

  public draw(): void {
        // Hantera bakgrundsfärgövergången
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
    
    push();
    translate(this.cameraOffset.x, this.cameraOffset.y);

    // Draw game entities (flowers first, honey, then enemies and clouds)
    for (const entity of this.gameEntities) {
      if (entity instanceof Flower) {
        entity.draw();
      }
    }

    // Draw honey (power-ups) after flowers
    for (const entity of this.gameEntities) {
      if (entity instanceof Honey) {
        entity.draw();
      }
    }

    // Draw enemies and clouds
    for (const entity of this.gameEntities) {
      if (entity instanceof Enemy) {
        entity.draw();
      }
      if (entity instanceof Moln) {
        // Assuming Moln is the cloud class
        entity.draw();
      }
    }

    // Draw player last to make sure it appears on top of the flowers, honey, enemies, and clouds
    const player = this.gameEntities.find((e) => e instanceof Player);
    if (player) {
      player.draw();
    }

    pop(); // Ensure text is not affected by camera translation

    // Draw floating texts correctly
    this.floatingTexts.forEach((text) => {
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
