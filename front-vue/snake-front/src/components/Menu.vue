<template>
  <div>
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
  </div>
</template>
<script>
import Phaser from 'phaser';
export default {
  name: 'Menu',
  data() {
    var UP = 0;
    var DOWN = 1;
    var LEFT = 2;
    var RIGHT = 3;
    var myId;
    var players = [];

    //var cursors;

    return {
      initialize: true,
      game: {
        type: Phaser.CANVAS,

        scene: {
          preload() {
            this.load.setBaseURL('http://labs.phaser.io');
            this.load.image(
              'otherPlayer',
              'assets/games/asteroids/asteroid1.png'
            );
            this.load.image('me', './assets/games/snake/body.png');
          },
          create() {
            var theScene = this;

            var Snake = new Phaser.Class({
              initialize: function Snake(scene, x, y, id, texture) {
                this.id = id;
                this.headPosition = new Phaser.Geom.Point(x, y);
                this.body = scene.add.group();
                this.head = this.body.create(x * 16, y * 16, texture);
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

                Phaser.Actions.ShiftPosition(
                  this.body.getChildren(),
                  this.headPosition.x * 16,
                  this.headPosition.y * 16,
                  1
                );

                this.moveTime = time + this.speed;

                return true;
              },
            });
            this.add.text(1, 1).setText('getting to know you');
            this.players = this.add.group();
            this.socket = new WebSocket('ws://localhost:3331/ws');
            this.socket.onopen = () => {
              console.log('Succesfully conected TO MENU');
            };
            this.socket.onclose = (event) => {
              console.log('Socket closed coon ', event);
            };
            this.socket.onerror = (errror) => {
              console.log('Socket error ', errror);
            };

            this.socket.onmessage = function(evt) {
              var you;
              var tipo = evt.data.split('\n');
              if (tipo[0] === 'welcome') {
                console.log('recibi un welcome');
                var currentPlayers = JSON.parse(tipo[2]);
                you = JSON.parse(tipo[4]);
                myId = you.playerid;
                // new Snake(theScene, you.x, you.y, you.playerid, 'me');
                for (var key in currentPlayers) {
                  var text = key === myId ? 'me' : 'otherPlayer';

                  players.push(
                    new Snake(
                      theScene,
                      currentPlayers[key].x,
                      currentPlayers[key].y,
                      currentPlayers[key].playerid,
                      text
                    )
                  );
                }
              } else if (tipo[0] === 'newPlayer') {
                var him = JSON.parse(tipo[1]);

                players.push(
                  new Snake(theScene, him.x, him.y, him.playerid, 'otherPlayer')
                );
              } else if (tipo[0] === 'updatePlayer') {
                console.log('recibi un update player');
                //  var player = JSON.parse(tipo[1]);
              }
            };
            //  cursors = this.input.keyboard.createCursorKeys();
          },

          update(time) {
            this.add.text(1, 1).setText(myId);

            /*  if (cursors.left.isDown) {
            } else if (cursors.right.isDown) {
            } else if (cursors.up.isDown) {
            } else if (cursors.down.isDown) {
            }*/
            players.forEach((px) => px.update(time));
          },
        },
      },
    };
  },
};
</script>
