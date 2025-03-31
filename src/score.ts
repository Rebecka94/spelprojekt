class Score {

  private color: string; 
  private currentHighScore: number;
  private currentScore: number;
  private position: p5.Vector;
  private sunImage: p5.Image;
  private moonImage: p5.Image;
  private currentImage: p5.Image;
  private targetImage: p5.Image;
  private alpha: number;
  private fading: boolean;

  constructor(color: string, currentHighScore: number, currentScore: number, position: p5.Vector, sunImage: p5.Image, moonImage: p5.Image) {

    this.color = color;
    this.currentHighScore = currentHighScore;
    this.currentScore = currentScore;
    this.position = position;
    this.sunImage = sunImage;
    this.moonImage = moonImage;
    this.currentImage = sunImage;
    this.targetImage = sunImage;
    this.alpha = 255;
    this.fading = false;
  }


  public update(): void {
    this.currentScore++;
  }


  /**
   * (Optional) Add a custom amount to the score
   */
  public addScore(value: number): void {
    this.currentScore += value;
  }

  public updateImage(backgroundBrightness: number): void {
    const newImage = backgroundBrightness < 100 ? this.moonImage : this.sunImage;
    if (this.targetImage !== newImage) {
      this.targetImage = newImage;
      this.fading = true;
    }
  }

  public draw(): void {
    push();
    
    if (this.fading) {
      this.alpha -= 10;
      if (this.alpha <= 0) {
        
        this.currentImage = this.targetImage;
        this.alpha = 255; 
        this.fading = false;
      }
    }

    tint(255, this.alpha);
    image(this.currentImage, this.position.x, this.position.y, 300, 300);

    noTint();
    
    fill(this.color);
    textAlign(CENTER, CENTER);

    textStyle(NORMAL); 
    // The next line is just a placeholder; customize your font if needed:
    textFont('Alfa Slab One');
    textSize(24); // Larger size for the score number
    text("POINTS", this.position.x + 160, this.position.y + 150); // Adjust position
    text(this.currentScore.toString(), this.position.x + 150, this.position.y + 200); // Adjust position for score

    pop();
  }

  // Displays the current high score (can be extended)
  public displayHighScore(): void {
    console.log(`High Score: ${this.currentHighScore}`);
  }

  // Updates the current high score if the score exceeds it
  public updateHighScore(): void {
    if (this.currentScore > this.currentHighScore) {
      this.currentHighScore = this.currentScore;
    }
  }
}


class FloatingText {
  position: p5.Vector;
  text: string;
  alpha: number;
  lifespan: number;
  velocity: p5.Vector;

  constructor(text: string, position: p5.Vector) {
    this.text = text;
    this.position = position.copy();
    this.alpha = 255;  // Fully visible at start
    this.lifespan = 60; // Lasts for 60 frames (1 second at 60fps)
    this.velocity = createVector(0, -1); // Move upwards
  }

  update() {
    this.position.add(this.velocity);
    this.alpha -= 4; // Fade out over time
  }

  draw() {
    push();
    fill(255, this.alpha);
    textSize(40);
    textAlign(CENTER, CENTER);
    text(this.text, this.position.x, this.position.y);
    pop();
  }

  isExpired() {
    return this.alpha <= 0;
  }
}