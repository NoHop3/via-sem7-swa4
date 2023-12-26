<script setup lang="ts">
</script>

<template>
  <main>
    <div class="home" >
      <h1>Welcome</h1>
      <router-link to="/login">
      <button>GET STARTED</button>
    </router-link>
    </div>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>