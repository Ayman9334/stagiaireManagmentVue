<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '../config/axiosConfig'

const stagiaire = ref([])

onMounted(() => {
  axiosClient.get('/stagiaire')
    .then(({ data }) => {
        stagiaire.value = data;
        console.log(stagiaire.value)
    })
})
</script>

<template>
    <div>
        hhh
    </div>
</template>
