<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center"></div>
    </v-app-bar>
    <v-main>
      <ToolBar />
      <Snake />
    </v-main>
  </v-app>
</template>

<script>
import ToolBar from './components/ToolBar';
import Snake from './components/Snake';
export default {
  name: 'App',

  components: {
    ToolBar,
    Snake,
  },

  data: () => ({
    //
  }),
};
</script>
