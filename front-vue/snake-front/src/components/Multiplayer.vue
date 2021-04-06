<template>
  <div class="hello">
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
  </div>
</template>
<script>
import Phaser from 'phaser';

export default {
  data() {
    return {
      initialize: true,
      game: { type: Phaser.WEBGL, backgroundColor: '#bfcc00' },
      scene: {
        preload() {},
        create() {},
        update() {},
      },
    };
  },
};
</script>
