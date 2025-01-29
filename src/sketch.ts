//---- GLOBAL VARIABLES ----//
let game: Game;
let music: {
jumpSound: p5.SoundFile;
};

let images: {
  player: p5.Image;
  bird: p5.Image;
  ufo: p5.Image;
  plane: p5.Image;
  flower: p5.Image;
  backgroundImage: p5.Image;
  arrowImage: p5.Image;
  continueImage: p5.Image;
  exitImage: p5.Image;
  repeatImage: p5.Image;
  cloud: p5.Image;
  score: p5.Image;
};

/**
 * Built in preload function in P5
 * This is a good place to load assets such as
 * sound files, images etc...
 */
function preload() {
  music = {
  jumpSound: loadSound("/assets/music/jump.mp3")
}

  images = {
    flower: loadImage("/assets/images/flower1.png"),
    player: loadImage("/assets/images/bee.png"),
    bird: loadImage("/assets/images/bird.gif"),
    ufo: loadImage("/assets/images/ufo.gif"),
    plane: loadImage("/assets/images/Plane.gif"),
    backgroundImage: loadImage("/assets/images/background.jpg"),
    arrowImage: loadImage("/assets/images/arrowkeys.png"),
    continueImage: loadImage("/assets/images/play-green.png"),
    exitImage: loadImage("/assets/images/exit.png"),
    repeatImage: loadImage("/assets/images/repeat.png"),
    cloud: loadImage("assets/images/cloud.png"),
    score: loadImage("assets/images/sun.png"),
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
  
  let audioStarted = false;

  function resumeAudio() {
    if (!audioStarted) {
      (getAudioContext() as AudioContext).resume();
      audioStarted = true;
      console.log("AudioContext resumed!");
    }
  }
  window.addEventListener("keydown", resumeAudio);
  window.addEventListener("click", resumeAudio);

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
