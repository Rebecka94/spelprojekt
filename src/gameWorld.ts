class GameWorld implements Scene {
  protected gameEntities: Entity[];
  private cloudImage: p5.Image;
  private score: Score; // Score instance
  private cameraOffset: p5.Vector; // We track how to shift the view
  private highestYReached: number; // Track the smallest y-value (the highest point)
  private pausImg: p5.Image;

  constructor() {
    this.gameEntities = [new Player(), this.createRandomEnemy()];
    this.cloudImage = images.cloud; // Load the cloud image
    this.pausImg = images.pausImg;

    const scorePosition = createVector(-100, -100); // Position for the score
    this.score = new Score("black", 0, 0, scorePosition, images.score); // Create score instance
    this.cameraOffset = createVector(0, 0);
    this.highestYReached = Infinity;

    this.initializeClouds(); // Initialize clouds
    this.initializeFlowers();
    this.generateBottomPlatform();
    this.cameraOffset = createVector(0, 0);
  }

  private createRandomEnemy(): Enemy {
    const types: ("bird" | "ufo" | "plane")[] = ["bird", "ufo", "plane"];
    const randomType = random(types);
    return new Enemy(randomType);
  }

  private initializeClouds() {
    const cloudPositions: { x: number; y: number }[] = [];

    for (let i = 0; i < 5; i++) {
      let width = random(50, 150); // Random cloud width
      let height = random(30, 80); // Random cloud height
      let x: number = 0,
        y: number = 0;
      let validPosition = false;

      while (!validPosition) {
        x = random(0, width + 1200);
        y = random(0, height + 1000);

        while (!validPosition) { // Ensure clouds do not overlap
          x = random(0, width + 1200); // Random horizontal position (canvas size + margin)
          y = random(0, height + 1000); // Random vertical position (canvas size + margin)

          validPosition = cloudPositions.every((pos) => {
            const distance = dist(pos.x, pos.y, x, y);
            return distance > Math.max(width, height); // Ensure spacing
          });

          if (validPosition) {
            cloudPositions.push({ x, y }); // Store valid position
          }
        }

        const cloud = new Moln(x, y, width, height, 0, this.cloudImage);
        this.gameEntities.push(cloud); // Add cloud to game entities
      }
    }
  }

  private initializeFlowers() {
    const flowerPositions = [];

    // Generera 5 blommor med horisontell position mellan 30% och 70%
    for (let i = 0; i < 5; i++) {
      const x = random(width * 0.3, width * 0.7); // Mellan 30% och 70% av bredden
      const y = random(0, height); // Hela höjden av skärmen
      flowerPositions.push(createVector(x, y));
      
      for (const pos of flowerPositions) {
        const flower = new Flower();
        flower.position = pos;
        this.gameEntities.push(flower);
      }
    }
    // Create flowers at the defined positions
  }

  private generateBottomPlatform() {
    const y = height - 50;
    const x = width / 2;

    const bottomFlower = new Flower();
    bottomFlower.position = createVector(x, y);
    this.gameEntities.push(bottomFlower);
  }

  // Check collisions between the player and other entities
  private checkCollision() {
    for (const gameEntity of this.gameEntities) {
      if (gameEntity instanceof Player) {
        for (const otherEntity of this.gameEntities) {
          if (otherEntity instanceof Player) continue;

          if (this.entitiesCollide(gameEntity, otherEntity)) {
            if (otherEntity instanceof Flower) {
              gameEntity.jump(); // example reaction
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
      o1.hitBoxPos.x,
      o1.hitBoxPos.y,
      o2.hitBoxPos.x,
      o2.hitBoxPos.y
    ); // dist(x1, y1, x2, y2) räknar ut avståndet mellan två punkter (hitboxarnas mittpunkter).
    return distance <= o1.hitBoxRadius + o2.hitBoxRadius;
  } // Om avståndet är mindre än eller lika med summan av de två hitboxarnas radier = kollision!

  private checkPlayerFall() {
    const player = this.gameEntities.find((entity) => entity instanceof Player);
    if (player && player.position.y > height) {
      game.changeScene("gameover"); // Switch to game over scene
    }
  }

  public update() {
    for (const gameEntitie of this.gameEntities) {
      gameEntitie.update();
    }
    // Find the player
    const player = this.gameEntities.find((e) => e instanceof Player) as Player;
    if (player) {
      // We do NOT move horizontally, so cameraOffset.x = 0
      this.cameraOffset.x = 0;

      // ONLY follow the player vertically:
      this.cameraOffset.y =
        height * 0.7 - (player.position.y + player.size.y / 2);

      // Check if the player reached a new highest position (smaller y is "higher")
      if (player.position.y < this.highestYReached) {
        this.highestYReached = player.position.y;
        // Increase score by 1 each time the player surpasses the old record
        this.score.update();
      }
    }
    this.checkPlayerFall();
    this.checkCollision();
  }

  public draw(): void {
    background("#2a9ec7");

    // Shift the entire scene according to cameraOffset
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
    this.score.draw();


    push();
    stroke(0); // Färgen på konturen (svart här)
    strokeWeight(50); // Tjockleken på konturen
    noFill(); // Fyll inte bilden (bara konturen)
    image(this.pausImg, width - 40 - 10, 10 + 10, 30, 40);
    pop();
  }
}
