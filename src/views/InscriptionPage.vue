<script setup>
import { ref } from 'vue'
import axiosClient from '../config/axiosConfig'

const login = ref('ayman')
const motDePasse = ref('123')

const errMessage = ref(null)

const inscription = (e) => {
  e.preventDefault()
  const req = { login: login.value, mot_de_passe: motDePasse.value }
  axiosClient
    .post('/auth/login', req)
    .then(({ data }) => {
      localStorage.setItem('ACCESS_TOKEN', data)
      location.href = '/'
    })
    .catch((err) => {
      if (err.response.status == 400) {
        errMessage.value = err.response.data
      }
    })
}
</script>

<template>
  <section class="Insciption vh-100 w-100 d-flex justify-content-center align-items-center">
    <form class="p-3 rounded" @submit="inscription" >
      <div class="h2">Connecter vous</div>
      <hr />
      <div class="mb-3">
        <label for="login" class="form-label">Login :</label>
        <input type="Login" class="form-control" id="login" v-model="login" required  @change="errMessage = null"/>
        <p v-if="errMessage" class="text-danger">{{ errMessage }}</p>
      </div>
      <div class="mb-3">
        <label for="mot_de_pass" class="form-label">Mot de pass :</label>
        <input
          type="password"
          class="form-control"
          id="mot_de_pass"
          v-model="motDePasse"
          required
          @change="errMessage = null"
        />
      </div>
      <input type="submit" class="btn btn-primary" value="Se connecter" />
    </form>
  </section>
</template>

<style scoped>
.Insciption {
  background-image: url('../assets/background.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
}
.Insciption form {
  width: 500px;
  max-width: 90%;
  background-color: rgba(255, 255, 255, 0.825);
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.156);
}
.Insciption form label {
  font-weight: 500;
}
</style>
