class GameWorld implements Scene {
  protected gameEntities: Entity[];
  private cloudImage: p5.Image;
  private score: Score;

  private cameraOffset: p5.Vector;
  private highestYReached: number;
  
  // ADDED: Variables to control flower spawning as player goes higher
  private nextFlowerSpawnY: number;
  private spawnInterval: number;

  constructor() {
    this.gameEntities = [new Player(), this.createRandomEnemy()];
    this.cloudImage = images.cloud; 

    // Initialize the score system
    const scorePosition = createVector(-100, -100);
    this.score = new Score("black", 0, 0, scorePosition, images.score);

    this.cameraOffset = createVector(0, 0);
    this.highestYReached = Infinity;

    // ADDED: spawnInterval and initial nextFlowerSpawnY
    // E.g., spawn new flowers every 400 pixels up.
    this.spawnInterval = 400;
    // If your player starts near the bottom of the screen, 
    // set this so the first batch spawns once you move above (below in value) y = height - 400
    this.nextFlowerSpawnY = height - 400;

    this.initializeClouds();
    this.initializeFlowers();
    this.generateBottomPlatform();

      // Skapa en ny fiende var tredje sekund
    setInterval(() => {
      const newEnemy = this.createRandomEnemy();
      this.gameEntities.push(newEnemy);
    }, 3000); // 5000 ms = 5 sekunder
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
      let width = random(50, 150);
      let height = random(30, 80);
      let x: number = 0, y: number = 0;
      let validPosition = false;

      while (!validPosition) {
        x = random(0, width + 1200);
        y = random(0, height + 1000);

        // Ensure clouds do not overlap
        while (!validPosition) {
          x = random(0, width + 1200);
          y = random(0, height + 1000);

          validPosition = cloudPositions.every((pos) => {
            const distance = dist(pos.x, pos.y, x, y);
            return distance > Math.max(width, height); 
          });

          if (validPosition) {
            cloudPositions.push({ x, y }); 
          }
        }

        const cloud = new Moln(x, y, width, height, 0, this.cloudImage);
        this.gameEntities.push(cloud);
      }
    }
  }

  private initializeFlowers() {
    const flowerPositions = [];

    // Generate 5 flowers with horizontal position between 30% and 70%
    for (let i = 0; i < 5; i++) {
      const x = random(width * 0.3, width * 0.6);
      const y = random(0, height);
      flowerPositions.push(createVector(x, y));
    }

    // Create flowers at the defined positions
    for (const pos of flowerPositions) {
      const flower = new Flower();
      flower.position = pos;
      this.gameEntities.push(flower);
    }
  }

  private generateBottomPlatform() {
    const y = height - 50;
    const x = width / 2;
    const bottomFlower = new Flower();
    bottomFlower.position = createVector(x, y);
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
            } else if (otherEntity instanceof Enemy) {
              game.changeScene("gameover");
            }
          }
        }
      }
    }
  }

  private entitiesCollide(o1: Entity, o2: Entity): boolean {
    const distance = dist(
      o1.hitBoxPos.x, o1.hitBoxPos.y,
      o2.hitBoxPos.x, o2.hitBoxPos.y
    );
    return distance <= o1.hitBoxRadius + o2.hitBoxRadius;
  }

  private checkPlayerFall() {
    const player = this.gameEntities.find((entity) => entity instanceof Player);
    if (player && player.position.y > height) {
      game.changeScene("gameover");
    }
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
    // Decide how many flowers to spawn each time
    const flowerCount = 2;

    for (let i = 0; i < flowerCount; i++) {
      const x = random(width * 0.3, width * 0.7);  
      // Place them somewhere above the player's current Y:
      const y = playerY - random(500, 1000);

      const flower = new Flower();
      flower.position = createVector(x, y);
      this.gameEntities.push(flower);
    }
  }

  public update() {
    for (const gameEntitie of this.gameEntities) {
      gameEntitie.update();
    }
    // Remove enemies that has left game area
    // this.removeOffscreenEnemies();
    // Find the player
    const player = this.gameEntities.find(e => e instanceof Player) as Player;
    if (player) {
      // We do NOT move horizontally, so cameraOffset.x = 0
      this.cameraOffset.x = 0;

      // ONLY follow the player vertically:
      this.cameraOffset.y = height * 0.7 - (player.position.y + player.size.y / 2);

      // Check if the player reached a new highest position
      if (player.position.y < this.highestYReached) {
        this.highestYReached = player.position.y;
        this.score.update();
      }

      // ADDED: Check if we should spawn more flowers above the player
      if (player.position.y < this.nextFlowerSpawnY) {
        this.spawnFlowersAbovePlayer(player.position.y);
        // Move the threshold further up so we spawn again later
        this.nextFlowerSpawnY -= this.spawnInterval;
      }
    }

    this.checkPlayerFall();
    this.checkCollision();
  }

  public draw(): void {
    background("#2a9ec7");

    push();
    translate(this.cameraOffset.x, this.cameraOffset.y);

    // Draw non-player entities first
    for (const entity of this.gameEntities) {
      if (!(entity instanceof Player)) {
        entity.draw();
      }
    }

    // Draw the player on top
    for (const entity of this.gameEntities) {
      if (entity instanceof Player) {
        entity.draw();
      }
    }
    pop();

    // Draw the score on the HUD (no camera translation)
    this.score.draw();
  }
}
