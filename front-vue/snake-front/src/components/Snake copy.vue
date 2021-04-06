<template>
  <div class="hello">
    <div @click="initializeGame" class="flex">
      <a href="#1" class="btn">Start</a>
    </div>
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
    <div v-if="finished"><PostScore :score="scoreX" /></div>
  </div>
</template>
<script>
import Phaser from 'phaser';
import PostScore from './PostScore';
export default {
  components: {
    PostScore,
  },
  data() {
    var snake;
    var food;
    var cursors;
    var UP = 0;
    var DOWN = 1;
    var LEFT = 2;
    var RIGHT = 3;
    var score = 0;
    var scoreText;
    var that = this;

    return {
      finished: false,
      initialize: true,
      scoreX: 0,
      game: {
        width: 640,
        height: 480,
        type: Phaser.WEBGL,
        backgroundColor: '#bfcc00',

        scene: {
          preload() {
            this.load.setBaseURL('http://labs.phaser.io');
            this.load.image('body', './assets/games/snake/body.png');
            this.load.image('food', 'assets/games/snake/food.png');
          },
          create() {
            scoreText = this.add.text(16, 16, 'score: 0', {
              fontSize: '32px',
              fill: '#000',
            });
            var Food = new Phaser.Class({
              Extends: Phaser.GameObjects.Image,

              initialize: function Food(scene, x, y) {
                Phaser.GameObjects.Image.call(this, scene);
                this.setTexture('food');
                this.setPosition(x * 16, y * 16);
                this.setOrigin(0);
                this.total = 0;
                scene.children.add(this);
              },
              eat: function() {
                this.total++;
                var x = Phaser.Math.Between(0, 39);
                var y = Phaser.Math.Between(0, 29);
                this.setPosition(x * 16, y * 16);
                score += 10;
                scoreText.setText('Score: ' + score);
              },
            });

            var Snake = new Phaser.Class({
              initialize: function Snake(scene, x, y) {
                this.headPosition = new Phaser.Geom.Point(x, y);
                this.body = scene.add.group();
                this.head = this.body.create(x * 16, y * 16, 'body');
                this.head.setOrigin(0);
                this.alive = true;
                this.speed = 150;
                this.tail = new Phaser.Geom.Point(x, y);
                this.moveTime = 0;
                this.heading = RIGHT;
                this.direction = RIGHT;
              },
              update: function(time) {
                if (time >= this.moveTime) {
                  return this.move(time);
                }
              },
              faceLeft: function() {
                if (this.direction === UP || this.direction === DOWN) {
                  this.heading = LEFT;
                }
              },

              faceRight: function() {
                if (this.direction === UP || this.direction === DOWN) {
                  this.heading = RIGHT;
                }
              },

              faceUp: function() {
                if (this.direction === LEFT || this.direction === RIGHT) {
                  this.heading = UP;
                }
              },

              faceDown: function() {
                if (this.direction === LEFT || this.direction === RIGHT) {
                  this.heading = DOWN;
                }
              },

              move: function(time) {
                switch (this.heading) {
                  case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(
                      this.headPosition.x - 1,
                      0,
                      40
                    );
                    break;

                  case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(
                      this.headPosition.x + 1,
                      0,
                      40
                    );
                    break;

                  case UP:
                    this.headPosition.y = Phaser.Math.Wrap(
                      this.headPosition.y - 1,
                      0,
                      30
                    );
                    break;

                  case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(
                      this.headPosition.y + 1,
                      0,
                      30
                    );
                    break;
                }

                this.direction = this.heading;

                //  Update the body segments
                Phaser.Actions.ShiftPosition(
                  this.body.getChildren(),
                  this.headPosition.x * 16,
                  this.headPosition.y * 16,
                  1
                );
                var hitBody = Phaser.Actions.GetFirst(
                  this.body.getChildren(),
                  { x: this.head.x, y: this.head.y },
                  1
                );
                if (hitBody) {
                  this.alive = false;
                  /*this method should call a new component*/
                  that.finished = true;
                  that.scoreX = score;

                  return false;
                } else {
                  this.moveTime = time + this.speed;
                  return true;
                }
              },
              grow: function() {
                var newPart = this.body.create(
                  this.tail.x,
                  this.tail.y,
                  'body'
                );

                newPart.setOrigin(0);
              },

              collideWithFood: function(food) {
                if (this.head.x === food.x && this.head.y === food.y) {
                  this.grow();
                  food.eat();
                  if (this.speed > 20 && food.total % 5 === 0) {
                    this.speed -= 25;
                  }
                  return true;
                } else {
                  return false;
                }
              },
            });

            snake = new Snake(this, 8, 8);
            food = new Food(this, 4, 3);
            cursors = this.input.keyboard.createCursorKeys();
          },
          update(time) {
            if (!snake.alive) {
              return;
            }
            if (cursors.left.isDown) {
              snake.faceLeft();
            } else if (cursors.right.isDown) {
              snake.faceRight();
            } else if (cursors.up.isDown) {
              snake.faceUp();
            } else if (cursors.down.isDown) {
              snake.faceDown();
            }

            if (snake.update(time)) {
              snake.collideWithFood(food);
            }
          },
        },
      },
    };
  },
  methods: {
    initializeGame() {
      this.initialize = true;
    },
  },
};
</script>
