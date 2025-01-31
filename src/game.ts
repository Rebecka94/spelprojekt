class Game {
  private startMenu: StartMenu;
  private gameOverMenu: GameOverMenu;
  private gameWorld: GameWorld;
  private activeScene: "start" | "gameover" | "game";



  constructor() {
    this.startMenu = new StartMenu(() => this.changeScene("game"));
    this.gameOverMenu = new GameOverMenu();
    this. gameWorld = new GameWorld();
    this.activeScene = "start";
  }

  
  public update() {
    if (this.activeScene === "start") {
      this.startMenu.update();
    } else if (this.activeScene === "gameover") {
      this.gameOverMenu.update();
    } else if (this.activeScene === "game") {
      this.gameWorld.update();
    }
  }
  
  public draw() {
    if (this.activeScene === "start") {
      this.startMenu.draw();
    } else if (this.activeScene === "gameover") {
      this.gameOverMenu.draw();
    } else if (this.activeScene === "game") {
      this.gameWorld.draw();
    }

  }
  
  public changeScene(nextScene: "start" | "gameover" | "game") {
    if (nextScene === "gameover") {
      music.backgroundMusic.stop();
    } else if (nextScene === "game") {
      if (!music.backgroundMusic.isPlaying()) {
        music.backgroundMusic.loop();
      }
    }
    
    this.activeScene = nextScene;
  }

  public resetGame() {
    this.gameWorld = new GameWorld();
    this.activeScene = "game";
  }
  
}











