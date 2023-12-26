<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { model } from '@/store/store'
</script>

<template>
  <div>
    <nav class="nav">
      <div class="navLeft" v-if="model.user.token !==''">
      <RouterLink to="/" class="redirect-button"><h3>Home</h3></RouterLink>
      </div>
    <div class="navRight">
      <RouterLink to="/register" class="redirect-button" v-if="model.user.token ===''"><h3>Register</h3></RouterLink>
      <RouterLink to="/login" class="redirect-button" v-if="model.user.token ===''"><h3>Login</h3></RouterLink>
      <RouterLink to="/login" class="redirect-button" v-if="model.user.token !==''"><h3>Log out</h3></RouterLink>
    </div>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
.nav{
  display: flex;
}
.navLeft {
  display: flex;
  justify-content:flex-start;
  background-color: rgb(6, 6, 61);
  width: 100%;
  margin: 0;
  padding: 0;
}
.navRight {
  display: flex;
  justify-content: flex-end;
  background-color: rgb(6, 6, 61);
  width: 100%;
  margin: 0;
  padding: 0;
}

.redirect-button {
  padding-left: 1rem;
  padding-right: 1rem;
  text-decoration: none;
  color: white;
}
</style>