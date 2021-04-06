<template>
  <div class="hello">
    <div @click="initializeGame" class="flex">
      <a href="#1" class="btn">Initialize</a>
    </div>
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
  </div>
</template>
<script>
import Phaser from 'phaser';

export default {
  data() {
    return {
      initialize: false,
      game: {
        width: '100%',
        height: '100%',
        type: Phaser.AUTO,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 200 },
          },
        },
        scene: {
          preload() {
            this.load.setBaseURL('http://labs.phaser.io');
            this.load.image('sky', 'assets/skies/space3.png');
            this.load.image('logo', 'assets/sprites/phaser3-logo.png');
            this.load.image('red', 'assets/particles/red.png');
          },
          init() {
            this.cameras.main.setBackgroundColor('#24252A');
          },
          create() {
            this.helloWorld = this.add.text(
              this.cameras.main.centerX,
              this.cameras.main.centerY,
              '',
              { font: '40px Arial', fill: '#ffffff' }
            );
            this.helloWorld.setOrigin(1);
            this.add.image('100%', '100%', 'sky');

            var particles = this.add.particles('blue');

            var emitter = particles.createEmitter({
              speed: 500,
              scale: { start: 1, end: 0 },
              blendMode: 'ADD',
            });

            var logo = this.physics.add.image(400, 400, 'logo');

            logo.setVelocity(50, 50);
            logo.setBounce(1, 1);
            logo.setCollideWorldBounds(true);

            emitter.startFollow(logo);
          },
          update() {},
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
