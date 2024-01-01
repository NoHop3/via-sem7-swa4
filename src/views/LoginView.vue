<template>
  <div class="frame">
    <div class="box">
      <form @submit.prevent="login">
        <h2 class="center">Login</h2>
        <div class="inputBox">
          <input type="text" id="Username" placeholder="Username" v-model="username" required />
          <i></i>
        </div>
        <div class="inputBox">
          <input type="password" id="Password" placeholder="Password" v-model="password" required />
          <i></i>
        </div>
        <div class="textColor2">
          Don't have an account? Register now
          <router-link to="/register">Login</router-link>
        </div>
        <div class="center">
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { authenticate } from '@/services/user.service';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      if (await authenticate(this.username, this.password)) {
        this.$router.push('/login');
      }
    },
  },
};
</script>