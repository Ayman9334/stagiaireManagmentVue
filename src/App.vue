<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <header>

    <div class="d-flex w-100 bg-primary p-3 gap-3">
      <div>
        <img src="./assets/logo.png" width="60" alt="" class="pe-4">
      </div>

      <div class="nav d-flex gap-3 h-100">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.nav > *{
  color: white;
  font-size: 20px;
  text-decoration: none;
}

</style>
