<template>
  <div>
    <p>Leaderboard</p>
    <v-container id="example-1">
      <v-row class="grey--text elevation-1">
        <v-col>Position</v-col>
        <v-col>Player</v-col>
        <v-col>Points</v-col>
      </v-row>
      <v-row class="elevation--1" v-for="(item, index) in data" :key="item.ID">
        <v-col>
          {{ index + 1 }}
        </v-col>
        <v-col>
          {{ item.UserName }}
        </v-col>
        <v-col>
          {{ item.Points }}
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  name: 'Leaderboard',
  data() {
    return {
      data: {},
    };
  },
  beforeMount() {
    this.getName();
  },
  methods: {
    async getName() {
      const res = await fetch('http://localhost:3333/');
      const data = await res.json();
      this.data = data;
    },
  },
};
</script>
