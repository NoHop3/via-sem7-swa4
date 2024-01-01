<template>
  <div class="frame">
    <div class="box">
      <form @submit.prevent="onSubmit">
        <h2 class="center">Profile</h2>
        <div class="inputBox">
          <div class="textColor2">Username:</div>
          <div class="textColor">{{ username }}</div>
        </div>
        <div class="inputBox">
          <div class="textColor2">Password:</div>
          <input type="text" id="Password" placeholder="New password" v-model="password" required />
        </div>
        <div class="center">
          <input type="submit" value="Save" />
        </div>
        <div v-if="successMessage !== ''" class="textColor2">{{ successMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { getUser, changePassword } from '../services/user.service'
import { store } from '@/store/store'

export default {
  data() {
    return {
      model: store,
      username: '',
      password: '',
      successMessage: ''
    }
  },
  methods: {
    async onSubmit() {
      try {
        await changePassword(store.user.token, this.password, store.user.userId)
        this.successMessage = 'Password changed!'
      } catch (error) {
        console.error('Error changing password:', error)
      }
    }
  },
  mounted() {
    getUser(store.user.token!, store.user.userId!).then((result) => {
      this.username = result.username
    })
  }
}
</script>

<style scoped>
/* Include your CSS here */
</style>