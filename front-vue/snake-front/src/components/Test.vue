<template>
  <div>
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
  </div>
</template>
<script>
import Phaser from 'phaser';
import sceneGame from './sceneGame';
import sceneLobby from './sceneLobby';

export default {
  data() {
    return {
      initialize: true,
      game: {
        type: Phaser.AUTO,
        scene: [sceneLobby, sceneGame],
      },
    };
  },
};
</script>
