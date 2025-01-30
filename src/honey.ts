/// <reference path="entity.ts" />

class Honey extends Entity {
    constructor(x: number, y: number) {
      super(x, y, 50, 50, 0, 0, images.star);
    }
  
    public applyEffect(score: Score) {
      score.addScore(20);
    }

}