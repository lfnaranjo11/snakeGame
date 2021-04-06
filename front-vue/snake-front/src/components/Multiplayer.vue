<template>
  <div>
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
  </div>
</template>
<script>
import Phaser from 'phaser';

export default {
  data() {
    var image;
    var text;
    var timedEvent;
    return {
      initialize: true,
      game: {
        width: 640,
        height: 480,
        type: Phaser.CANVAS,
        backgroundColor: '#eb34e5',
        scene: {
          preload() {
            this.load.setBaseURL('http://labs.phaser.io');
            this.load.image('ball', 'assets/games/asteroids/asteroid1.png');
            this.load.image('einstein', 'assets/pics/ra-einstein.png');
          },
          create() {
            image = this.add.image(400, 300, 'einstein');

            text = this.add.text(32, 32);
            // timedEvent = this.time.addEvent({ delay: 2000, callback: onEvent, callbackScope: this });

            timedEvent = this.time.addEvent({
              delay: 500,
              callback: function onEvent() {
                image.rotation += 0.04;
              },
              callbackScope: this,
              loop: true,
            });
            /*
            var emitter = new Phaser.Events.EventEmitter();
            var handler = (x, y) => {
              this.add.image(x, y, 'ball');
            };
            emitter.on('addImage', handler, this);

            emitter.emit('addImage', 100, 100);
            emitter.emit('addImage', 400, 300);

            
            emitter.emit('addImage', 600, 300);*/
            this.add.text(16, 16, 'hola', {
              fontSize: '32px',
              fill: '#000',
            });
          },

          update() {
            text.setText(
              'Event.progress: ' +
                timedEvent
                  .getProgress()
                  .toString()
                  .substr(0, 4)
            );
          },
          render() {},
        },
      },
    };
  },
};
</script>
