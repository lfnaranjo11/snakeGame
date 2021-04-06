<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center"></div>
    </v-app-bar>
    <v-main>
      <ToolBar />
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <Snake />
        </v-col>
        <v-col class="text-center" cols="12">
          <Leaderboard />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import ToolBar from './components/ToolBar';
import Snake from './components/Snake';
import Leaderboard from './components/Leaderboard';
export default {
  name: 'App',

  components: {
    ToolBar,
    Snake,
    Leaderboard,
  },

  data: () => ({
    //
  }),
};
</script>
