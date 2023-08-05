<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onBeforeMount, ref } from 'vue'

const auth = ref(false)
onBeforeMount(() => {
  auth.value = localStorage.getItem('ACCESS_TOKEN') != null ? true : false
})
</script>

<template>
  <header v-if="auth">
    <div class="d-flex w-100 bg-primary p-3 gap-3">
      <div>
        <img src="./assets/logo.png" width="60" alt="" class="pe-4" />
      </div>

      <div class="nav d-flex gap-3 h-100">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/inscription">Inscription</RouterLink>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.nav > * {
  color: white;
  font-size: 20px;
  text-decoration: none;
}
</style>
