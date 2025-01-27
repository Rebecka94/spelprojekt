
//---- GLOBAL VARIABLES ----//
let game: Game;

let images: {
  flower: p5.Image;
  player: p5.Image;
  backgroundImage: p5.Image;
  arrowImage: p5.Image;  
  continueImage: p5.Image;
  exitImage: p5.Image;
  repeatImage: p5.Image;
  score: p5.Image;
   cloud: p5.Image;


}




/**
 * Built in preload function in P5
 * This is a good place to load assets such as
 * sound files, images etc...
 */


function preload() {

  images = {
    flower: loadImage("/assets/images/flower1.png"),
    player: loadImage("/assets/images/bee.png"),
    backgroundImage: loadImage("/assets/images/background.jpg"),
    arrowImage: loadImage("/assets/images/arrowkeys.png"),
    continueImage: loadImage("/assets/images/play-green.png"),
    exitImage: loadImage("/assets/images/exit.png"),
    repeatImage: loadImage("/assets/images/repeat.png"),
     cloud: loadImage("assets/images/cloud.png"),
     score: loadImage("assets/images/sun.png")

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
  resizeCanvas(windowWidth, windowHeight)
}
