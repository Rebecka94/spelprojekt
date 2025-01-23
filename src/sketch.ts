//---- GLOBAL VARIABLES ----//
let game: Game;
let images: {
  player: p5.Image;
  flower: p5.Image;
}

/**
 * Built in preload function in P5
 * This is a good place to load assets such as
 * sound files, images etc...
 */
function preload() {
  // music = {
  //   mystery: loadSound("/assets/music/mystery.mp3")
  // }
  images = {
    player: loadImage("/assets/images/bee.png"),
    flower: loadImage("/assets/images/flower.png")
  };

}

/**
 * Built in setup function in P5
 * This is a good place to create your first class object
 * and save it as a global variable so it can be used
 * in the draw function belows
 */

function setup() {
 createCanvas(windowWidth, windowHeight);
  frameRate(60);

  //music.mystery.setVolume(0.8);
  game = new Game();
}

/**
 * Built in draw function in P5
 * This is a good place to call public methods of the object
 * you created in the setup function above
 */
function draw() {
  game.update();
  game.draw();
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


