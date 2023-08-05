<script setup>
import { ref } from 'vue'

const lst = ref(['dagsdrgd', 'dwad', 'oiufg'])

</script>

<template>
  <main>
    <div v-for="lt in lst">{{ lt }}</div>
    this is home view
  </main>
</template>
