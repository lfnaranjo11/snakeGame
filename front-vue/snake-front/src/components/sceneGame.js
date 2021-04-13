import Phaser from 'phaser';
export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function SceneGame() {
    Phaser.Scene.call(this, { key: 'sceneGame' });
  },
  init: function(data) {
    console.log('init', data);

    this.myId = data.id;
    this.externalPlayers = data.players;
    this.socket = data.socket;
    this.scenePlayers = [];
  },
  preload: function() {
    this.load.setBaseURL('http://labs.phaser.io');
    this.load.image('otherPlayer', 'assets/games/asteroids/asteroid1.png');
    this.load.image('me', './assets/games/snake/body.png');
  },

  create: function() {
    var UP = 0;
    var DOWN = 1;
    var LEFT = 2;
    var RIGHT = 3;
    var scene = this;
    this.scenePlayers = [];

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
          return true;
        }
        return false;
      },

      faceRight: function() {
        if (this.direction === UP || this.direction === DOWN) {
          this.heading = RIGHT;
          return true;
        }
        return false;
      },

      faceUp: function() {
        if (this.direction === LEFT || this.direction === RIGHT) {
          this.heading = UP;
          return true;
        } else {
          return false;
        }
      },

      faceDown: function() {
        if (this.direction === LEFT || this.direction === RIGHT) {
          this.heading = DOWN;
          return true;
        }
        return false;
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
    this.externalPlayers.forEach((px) => {
      var text = px.id === this.myId ? 'me' : 'otherPlayer';
      this.scenePlayers.push(
        new Snake(scene, px.headPosition.x, px.headPosition.y, px.id, text)
      );
    });
    this.cursors = this.input.keyboard.createCursorKeys();

    scene.add.text(50, 60, 'game Started', 16).setOrigin(0.5);
    this.socket.onmessage = function(evt) {
      var tipo = evt.data.split('\n');
      if (tipo[0] === 'updatePlayer') {
        console.log('recibi un update player');
        console.log(tipo[1]);
        try {
          var sneaky = JSON.parse(tipo[1]);

          scene.scenePlayers.forEach((px) => {
            if (px.id === sneaky.playerid) {
              console.log(px);

              switch (sneaky.direction) {
                case LEFT:
                  px.faceLeft();
                  break;
                case RIGHT:
                  px.faceRight();
                  break;
                case DOWN:
                  px.faceDown();
                  break;
                case UP:
                  px.faceUp();
                  break;
              }
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    };
  },
  update(time) {
    var newObject = {};
    newObject.playerid = this.myId;

    if (this.cursors.up.isDown) {
      newObject.direction = 0;

      this.scenePlayers.forEach((px) => {
        if (px.id === this.myId && px.faceUp(time)) {
          this.socket.send('updatePlayer\n');
          this.socket.send(JSON.stringify(newObject));
        }
      });
    } else if (this.cursors.down.isDown) {
      newObject.direction = 1;
      this.scenePlayers.forEach((px) => {
        if (px.id === this.myId && px.faceDown(time)) {
          this.socket.send('updatePlayer\n');
          this.socket.send(JSON.stringify(newObject));
        }
      });
    } else if (this.cursors.left.isDown) {
      newObject.direction = 2;

      this.scenePlayers.forEach((px) => {
        if (px.id === this.myId && px.faceLeft(time)) {
          this.socket.send('updatePlayer\n');
          this.socket.send(JSON.stringify(newObject));
        }
      });
    } else if (this.cursors.right.isDown) {
      newObject.direction = 3;

      this.scenePlayers.forEach((px) => {
        if (px.id === this.myId && px.faceRight(time)) {
          this.socket.send('updatePlayer\n');
          this.socket.send(JSON.stringify(newObject));
        }
      });
    }
    this.scenePlayers.forEach((px) => {
      px.update(time);
    });
  },
});
