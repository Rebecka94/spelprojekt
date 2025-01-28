class GameWorld implements Scene {
  protected gameEntities: Entity[]; // Array for game entities
  private cloudImage: p5.Image;
  private score: Score; // Score instance
  private cameraY: number; // Vertical offset for scrolling
  private player: Player; // Reference to the player

  constructor() {
    this.gameEntities = [];
    this.cloudImage = images.cloud; // Load the cloud image
    this.cameraY = 0; // Initialize camera offset

    // Initialize the score system
    const scorePosition = createVector(-100, -100); // Position for the score
    this.score = new Score("black", 0, 0, scorePosition, images.score); // Create score instance
 
    // Initialize other entities
    this.initializeClouds();
    this.initializeFlowers();
    
    // Add the player to the game entities
    this.player = new Player();
    this.gameEntities.push(this.player);
    this.createRandomEnemy(); 
    

   
  }

  private createRandomEnemy(): Enemy {
    const types: ("bird" | "ufo" | "plane")[] = ["bird", "ufo", "plane"];
    const randomType = random(types); // Randomize enemy type
    return new Enemy(randomType);
  }

  private initializeClouds() {
    for (let i = 0; i < 5; i++) {
      const width = random(50, 150); // Random cloud width
      const height = random(30, 80); // Random cloud height
      const x = random(0, width + 1200);
      const y = random(-height, height + 1000); // Allow clouds above the initial view
      const cloud = new Moln(x, y, width, height, 0, this.cloudImage);
      this.gameEntities.push(cloud); // Add cloud to game entities
    }
  }

  private initializeFlowers() {
    for (let i = 0; i < 5; i++) {
      const x = random(width * 0.3, width * 0.7);
      const y = random(0, height); // Position flowers randomly in the initial view
      const flower = new Flower();
      flower.position = createVector(x, y);
      this.gameEntities.push(flower);
    }
  }

  private checkCollision() {
    for (const gameEntity of this.gameEntities) {
      if (gameEntity instanceof Player) {
        for (const otherEntity of this.gameEntities) {
          if (otherEntity instanceof Player) continue; // Skip self

          if (this.entitiesCollide(gameEntity, otherEntity)) {
            if (otherEntity instanceof Flower) {
              gameEntity.jump(); // Player jumps on collision with a flower
            }
          }
        }
      }
    }
  }

  private entitiesCollide(o1: Entity, o2: Entity): boolean {
    return (
      o1.position.x < o2.position.x + o2.size.x &&
      o1.position.x + o1.size.x > o2.position.x &&
      o1.position.y < o2.position.y + o2.size.y &&
      o1.position.y + o1.size.y > o2.position.y
    );
  }

 

  private recycleEntities() {
    for (let i = 0; i < this.gameEntities.length; i++) {
      const entity = this.gameEntities[i];
  
      // Reposition entities that move out of the visible area
      if (entity.position.y < this.cameraY - entity.size.y) {
        if (entity instanceof Flower) {
          // Remove the old flower and create a new one above the current view
          this.gameEntities.splice(i, 1);
          const newFlower = this.createRandomFlower();
          this.gameEntities.push(newFlower);
          i--; // Adjust index
        } else {
          // Recycle other entities (e.g., clouds) by repositioning them above the view
          entity.position.y = this.cameraY + height + random(100, 300);
          entity.position.x = random(0, width); // Optional: Randomize horizontal position
        }
      }
    }
  }
  
 
  // Helper method to create a random flower
  private createRandomFlower(): Flower {
    const x = random(width * 0.3, width * 0.7); // Random horizontal position
    const y = this.cameraY + height + random(100, 300); // Position above the current view
    const flower = new Flower();
    flower.position = createVector(x, y); // Set flower's position
    return flower;
  }

 

 public update() {
     // Update all entities
  for (const gameEntity of this.gameEntities) {
    gameEntity.update();
  }

  // Ensure the camera follows the player
  const player = this.gameEntities.find(entity => entity instanceof Player) as Player;

  if (player && player.position.y < this.cameraY + height * 0.5) {
    // Move the camera up when the player reaches the top half of the screen
    this.cameraY -= (this.cameraY + height * 0.5 - player.position.y) * 0.1; // Smooth movement
  }

  // Recycle entities when they go out of view
  this.recycleEntities();

  // Check collisions
  this.checkCollision();
  
  
  }





  public draw(): void {
    background("#2a9ec7"); // Clear the screen with the background color

  for (const entity of this.gameEntities) {
    // Adjust entity positions based on cameraY
    const drawY = entity.position.y - this.cameraY;

    // Only draw entities within the visible screen
    if (drawY > -entity.size.y && drawY < height) {
      push();
      translate(0, -this.cameraY); // Translate based on camera
      entity.draw();
      
      pop();
    }
  }
  

  this.score.draw(); // Always draw the score
  }
}