<script setup lang="ts">
import Intro from '@/components/Intro.vue'
</script>

<template>
  <main>
    <h1>Tic Tac Toe</h1>
    <Intro />
    <Board />
  </main>
</template>

<style scoped>
main {
  display: flex;
  width: 100%;
  max-width: 800px;
  margin-inline: auto;
  margin-block: 2rem;
}
</style>
