<template>
  <div>
    <v-text-field filled placeholder="Your name" v-model="name"></v-text-field>
    <v-btn depressed color="primary" @click="createPost">Post Score</v-btn>
    {{ score }}
  </div>
</template>
<script>
const axios = require('axios');

export default {
  props: { score: { type: Number } },
  name: 'PostScore',
  data() {
    return {
      data: {},
    };
  },
  methods: {
    async createPost() {
      this.data.UserName = this.name;
      // this.data.Points = this.props.score;
      // console.log(this.props.score);
      this.data.Points = this.score;
      console.log(this.score);

      axios.post('http://localhost:3333/score', this.data).then((resp) => {
        this.data = resp;
        console.log(resp);
      });
    },
  },
};
</script>
