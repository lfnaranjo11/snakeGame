import Phaser from 'phaser';

export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function SceneB() {
    Phaser.Scene.call(this, { key: 'sceneLobby' });
  },
  preload: function() {
    this.load.image(
      'cartoon',
      'https://images.ctfassets.net/d6skzop43my5/1lC7F7TRukFQLrppon2JxU/db50c525ff876db96469107e9b4a960d/press-release-snake.jpg?q=50'
    );
    this.load.setBaseURL('http://labs.phaser.io');
    this.load.image('otherPlayer', 'assets/games/asteroids/asteroid1.png');
    this.load.image('me', './assets/games/snake/body.png');
  },
  create: function() {
    var RIGHT = 3;
    var myId;

    var players = [];
    var image = this.add.image(400, 300, 'cartoon').setScale(1);
    var scene = this;
    var theScene = this;

    this.input.once(
      'pointerdown',
      function() {
        this.scene.start('sceneGame', {
          id: myId,
          players: players,
          socket: theScene.socket,
        });
        this.socket.send('startGame\n');
      },
      this
    );
    this.time.addEvent({
      delay: 2000,
      callback: function unapper() {
        image.destroy();
        scene.add.text(16, 16, 'current players:');
        scene.add.text(400, 400, 'clicK to start the game', 16).setOrigin(0.5);
      },
      callbackScope: this,
      loop: true,
    });
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
    });
    this.add.text(1, 1).setText('click to start game');
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
      } else if (tipo[0] === 'startGame') {
        console.log('orden de cordinacion');
        theScene.scene.start('sceneGame', {
          id: myId,
          players: players,
          socket: theScene.socket,
        });
      }
    };
  },
});
