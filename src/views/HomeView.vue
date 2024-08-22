<script setup lang="ts">
import Intro from '@/components/Intro.vue'
import Board from '@/components/Board.vue'
</script>

<template>
  <main>
    <Intro />
    <Board />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin-inline: auto;
  margin-block: 2rem;
}
</style>
