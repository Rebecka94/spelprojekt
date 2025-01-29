/// <reference path="entity.ts" />
class Enemy extends Entity {
  constructor(type: "bird" | "ufo" | "plane" = "bird") {
    let image: p5.Image;
    let width: number;
    let height: number;
    let speedX: number;
    let speedY: number;
    let startX: number;
    let startY: number;

    switch (type) {
      case "ufo":
        image = images.ufo;
        width = 220;
        height = 150;
        speedX = random(-5, -2); // Rörelse från höger till vänster
        speedY = random(-1, 1); // Lätt vertikal rörelse
        startX = windowWidth + width; // Start från höger utanför skärmen
        startY = random(height * 0.1, height * 0.3); // Slumpmässig höjd (10% till 30%)
        break;

      case "plane":
        image = images.plane;
        width = 170;
        height = 110;
        speedX = random(2, 4); // Rörelse från vänster till höger
        speedY = random(-0.5, 1); // Lätt vertikal rörelse
        startX = -width; // Start från vänster utanför skärmen
        startY = random(height * 0.6, height * 0.9); // Slumpmässig höjd (60% till 90%)
        break;

      case "bird":
      default:
        image = images.bird;
        width = 170;
        height = 170;
        speedX = random(2, 5); // Rörelse från vänster till höger
        speedY = random(-0.5, 0.5); // Nästan ingen vertikal rörelse
        startX = -width; // Start från vänster utanför skärmen
        startY = random(height * 0.3, height * 0.6); // Slumpmässig höjd (30% till 60%)
        break;
    }

    // Skapa fienden med dessa egenskaper
    super(startX, startY, width, height, speedX, speedY, image);
  }
}
