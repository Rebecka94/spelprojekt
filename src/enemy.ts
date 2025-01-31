/// <reference path="entity.ts" />
class Enemy extends Entity {
  private sound: p5.SoundFile;

  constructor(type: "bird" | "ufo" | "plane" = "bird") {
    let image: p5.Image;
    let width: number;
    let height: number;
    let speedX: number;
    let speedY: number;
    let startX: number;
    let startY: number;
    let sound: p5.SoundFile;

    switch (type) {
      case "ufo":
        image = images.ufo;
        width = 150;
        height = 80;
        speedX = random(-5, -2); // Rörelse från höger till vänster
        speedY = random(-1, 1); // Lätt vertikal rörelse
        startX = windowWidth + width; // Start från höger utanför skärmen
        startY = random(height * 0.1, height * 0.3); // Slumpmässig höjd (10% till 30%)
        sound = enemySounds.ufo;
        break;

      case "plane":
        image = images.plane;
        width = 120;
        height = 60;
        speedX = random(2, 4); // Rörelse från vänster till höger
        speedY = random(1, 2); // Lätt vertikal rörelse
        startX = -width; // Start från vänster utanför skärmen
        startY = random(height * 0.6, height * 0.9); // Slumpmässig höjd (60% till 90%)
        sound = enemySounds.plane;
        break;

      case "bird":
      default:
        image = images.bird;
        width = 100;
        height = 100;
        speedX = random(2, 5); // Rörelse från vänster till höger
        speedY = random(-0.5, 0.5); // Nästan ingen vertikal rörelse
        startX = -width; // Start från vänster utanför skärmen
        startY = random(height * 0.3, height * 0.6); // Slumpmässig höjd (30% till 60%)
        sound = enemySounds.bird;
        break;
    }

    // Skapa fienden med dessa egenskaper
    super(startX, startY, width, height, speedX, speedY, image);
    this.sound = sound;

    // Spela ljudet efter 10 sekunder (10 000 ms)
    setTimeout(() => {
      if (!this.sound.isPlaying()) {
        this.sound.play();
        this.sound.setVolume(1.0); // Startvolym vid 100%
      }

      // Efter 4 sekunder (4000 ms), fasa ut ljudet och stoppa det
      setTimeout(() => {
        let fadeDuration = 1000; // 1 sekund för fade-out
        let fadeSteps = 15; // Antal steg i fade-out
        let interval = fadeDuration / fadeSteps;
        let currentVolume = 1.0;
        let fadeStep = currentVolume / fadeSteps;

        let fadeInterval = setInterval(() => {
          currentVolume -= fadeStep;
          if (currentVolume <= 0) {
            currentVolume = 0;
            this.sound.stop();
            clearInterval(fadeInterval);
          }
          this.sound.setVolume(currentVolume);
        }, interval);
      }, 4000); // Vänta 4 sekunder innan fade-out börjar
    }, 1000); // Vänta 1 sekund innan ljudet börjar spelas
  }
}
