<template>
  <div class="frame">
    <div class="box">
      <form @submit.prevent="register">
        <h2 class="center">Register</h2>
        <div class="inputBox">
          <input v-model="username" type="text" id="Username" placeholder="Username" required />
          <i></i>
        </div>
        <div class="inputBox">
          <input v-model="password" type="password" id="Password" placeholder="Password" required />
          <i></i>
        </div>
        <div class="textColor2">
          Already have an account?
          <router-link to="/login">Login</router-link>
        </div>
        <div class="center">
          <input type="submit" value="Register" />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import service from '@/services/auth.service'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async register() {
      if(await service.authenticate(this.username, this.password)){
        this.$router.push('/login')
      }
    }
  }
}
</script>