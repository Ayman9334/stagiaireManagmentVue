<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onBeforeMount, ref } from 'vue'

const auth = ref(false)

onBeforeMount(() => {
  auth.value = localStorage.getItem('ACCESS_TOKEN') != null ? true : false
})

const deconnecter = () => {
  auth.value = localStorage.removeItem('ACCESS_TOKEN')
  location.reload();
}
</script>

<template>
  <header v-if="auth">
    <div class="d-flex w-100 bg-primary p-3 justify-content-between">
      <div class="d-flex gap-3">
        <div>
          <img src="./assets/logo.png" width="60" alt="" class="pe-4" />
        </div>

        <div class="nav d-flex gap-3 h-100 ms-4">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/stagiaire">Stagiaire</RouterLink>
        </div>
      </div>
      <div>
        <button class="btn btn-info text-light" @click="deconnecter"><i class="fas fa-sign-out"></i> logout</button>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.nav>* {
  color: white;
  font-size: 20px;
  text-decoration: none;
}
</style>
