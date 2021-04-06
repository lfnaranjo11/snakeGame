<template>
  <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
    <v-tab>
      SinglePlayer
    </v-tab>
    <v-tab>
      Multiplayer
    </v-tab>
    <v-tab>
      LeaderBoard
    </v-tab>
  </v-tabs>
</template>
<script>
export default {
  name: 'ToolBar',
  data() {
    return {
      tab: null,
      items: ['SinglePlayer', 'Multiplayer', 'LeaderBoard'],
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    };
  },
};
</script>
<style>
.basil {
  background-color: #fffbe6 !important;
}
.basil--text {
  color: #356859 !important;
}
</style>
