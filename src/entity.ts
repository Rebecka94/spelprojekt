class Entity {
  public position: p5.Vector;
  public size: p5.Vector;
  public velocity: p5.Vector;
  protected image: p5.Image;
  public hitBoxPos: p5.Vector; //Hitboxens position (mitten av entiteten).
  public hitBoxRadius: number; // Storleken på hitboxen (hur stor cirkeln är).


//inför hitbox

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    velocityX: number,
    velocityY: number,
    image: p5.Image
  ) {
    this.position = createVector(x, y);
    this.size = createVector(width, height);
    this.velocity = createVector(velocityX, velocityY);
    this.image = image;
    this.hitBoxPos = createVector(x + width / 2, y + height / 2); // Räknar ut mitten av entiteten
    this.hitBoxRadius = Math.min(width, height) * 0.35; // Gör hitboxen mindre än själva objektet genom att ta den minsta av width och height, och sen multiplicera med 0.2
  }
  

  public update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.hitBoxPos.set(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2); // Ser till att hitboxen följer med när spelaren rör sig.

  }

  public draw() {
    push();
    image(
      this.image,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
    pop();
  }
}
