<template>
  <div class="hello">
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
    var poison;
    var cursors;
    var UP = 0;
    var DOWN = 1;
    var LEFT = 2;
    var RIGHT = 3;
    var score = 0;
    var scoreText;
    var that = this;
    var text1;
    var timedEvent1;
    var text2;
    var timedEvent2;
    var obs;

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
            this.load.image('poison', 'assets/games/asteroids/asteroid1.png');
            this.load.image('obstacle', 'assets/games/asteroids/ship.png');
            this.load.image('tiles', 'assets/tilemaps/tiles/gridtiles.png');
          },
          create() {
            scoreText = this.add.text(16, 16, 'score: 0', {
              fontSize: '32px',
              fill: '#000',
            });
            var ObstacleSet = new Phaser.Class({
              initialize: function(scene) {
                this.grupo = scene.add.group();
              },
              addObstacle: function() {
                var x = Phaser.Math.Between(0, 39);
                var y = Phaser.Math.Between(0, 29);
                this.grupo.create(x * 16, y * 16, 'obstacle');
              },
            });

            var Poison = new Phaser.Class({
              Extends: Phaser.GameObjects.Image,
              initialize: function Poison(scene, x, y) {
                Phaser.GameObjects.Image.call(this, scene);
                this.setTexture('poison');
                this.setPosition(x * 16, y * 16);
                this.setOrigin(0);
                this.total = 0;
                this.alive = true;
                scene.children.add(this);
              },
              eat: function() {
                var x = Phaser.Math.Between(0, 39);
                var y = Phaser.Math.Between(0, 29);
                this.setPosition(x * 16, y * 16);
              },
              move: function() {
                var x = Phaser.Math.Between(0, 39);
                var y = Phaser.Math.Between(0, 29);
                this.setPosition(x * 16, y * 16);
              },
              disappear: function() {
                this.alive = false;
                this.destroy();
              },
              apppearAndDisappear: function() {
                this.alive = !this.alive;
                if (this.alive) {
                  this.move();
                }
              },
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
                var hitObs = Phaser.Actions.GetFirst(
                  obs.grupo.getChildren(),
                  { x: this.head.x, y: this.head.y },
                  0
                );

                var hitBody = Phaser.Actions.GetFirst(
                  this.body.getChildren(),
                  { x: this.head.x, y: this.head.y },
                  1
                );
                if (hitBody || hitObs) {
                  this.alive = false;
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
              ungrow: function() {
                var invaders = this.body.getChildren();
                if (this.body.getChildren().length >= 3) {
                  Phaser.Utils.Array.RemoveAt(
                    invaders,
                    this.body.getChildren().length - 1,
                    function(jj) {
                      jj.destroy();
                    }
                  );
                  Phaser.Utils.Array.RemoveAt(
                    invaders,
                    this.body.getChildren().length - 1,
                    function(jj) {
                      jj.destroy();
                    }
                  );
                  return true;
                } else {
                  this.alive = false;
                  that.finished = true;
                  that.scoreX = score;
                  return false;
                }
              },
              collideWithPoison: function(poison) {
                if (this.head.x === poison.x && this.head.y === poison.y) {
                  this.ungrow();
                  poison.destroy();

                  return true;
                } else {
                  return false;
                }
              },
              collideWithFood: function(food) {
                if (this.head.x === food.x && this.head.y === food.y) {
                  this.grow();
                  food.eat();
                  if (this.speed > 20 && food.total % 5 === 0) {
                    this.speed -= 25;
                  }
                  if (food.total % 10 == 0) {
                    obs.addObstacle();
                  }
                  return true;
                } else {
                  return false;
                }
              },
            });
            snake = new Snake(this, 8, 8);
            food = new Food(this, 4, 3);
            poison = new Poison(this, 12, 3);
            text1 = this.add.text(32, 32);
            text2 = this.add.text(100, 100);
            obs = new ObstacleSet(this);
            /*
            obs = new ObstacleSet();
            obs.addObstacle();
*/
            timedEvent1 = this.time.addEvent({
              delay: 10000,
              callback: function apper() {
                poison = new Poison(this, 12, 3);
                poison.move();
              },
              callbackScope: this,
              loop: true,
            });
            timedEvent2 = this.time.addEvent({
              delay: 7000,
              callback: function unapper() {
                poison.destroy();
              },
              callbackScope: this,
              loop: true,
            });
            cursors = this.input.keyboard.createCursorKeys();
          },
          update(time) {
            text1.setText(
              'Event.progress appear: ' +
                timedEvent1
                  .getProgress()
                  .toString()
                  .substr(0, 4)
            );
            text2.setText(
              'Event.progress disappear: ' +
                timedEvent2
                  .getProgress()
                  .toString()
                  .substr(0, 4)
            );
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
              snake.collideWithPoison(poison);
              snake.collideWithFood(food);
            }
          },
        },
      },
    };
  },
};
</script>
