<template>
  <v-app>
    <v-card color="basil">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold display-3 basil--text">
          SNake
        </h1>
      </v-card-title>

      <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
        <v-tab>
          Multiplayer
        </v-tab>
        <v-tab>
          SinglePlayer
        </v-tab>
        <v-tab>
          LeaderBoard
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <Menu />
        </v-tab-item>
        <v-tab-item>
          <v-card color="basil" flat>
            <v-card-text></v-card-text>
            <Menu />
          </v-card>
        </v-tab-item>
        <v-tab-item> <Snake /></v-tab-item>

        <v-tab-item><Leaderboard /> </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-app>
</template>

<script>
import Snake from './components/Snake';
import Leaderboard from './components/Leaderboard';
import Menu from './components/Menu';
export default {
  name: 'App',

  components: {
    Menu,
    Snake,
    Leaderboard,
  },

  data() {
    return {
      tab: null,
    };
    //
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
