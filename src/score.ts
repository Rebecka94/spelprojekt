class Score {

  private color: string; 
  private currentHighScore: number;
  public currentScore: number;
  private position: p5.Vector;
  private image: p5.Image; 

  constructor(color: string, currentHighScore: number, currentScore: number, position: p5.Vector, image: p5.Image) {

    this.color = color;
    this.currentHighScore = currentHighScore;
    this.currentScore = currentScore;
    this.position = position;
    this.image = image;
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

  public draw(): void {
    push();
    
    image(this.image, this.position.x, this.position.y, 300, 300); // Adjust size as needed

    // Display the score text within the visible portion of the image
    fill(this.color);
    textAlign(CENTER, CENTER);

    textStyle(NORMAL); 
    // The next line is just a placeholder; customize your font if needed:
    textFont('letter-spacing');
    textSize(30); // Larger size for the score number
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
