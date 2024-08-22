<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img src="@/assets/logo.svg" alt="Tic Tac Toe Logo" class="logo" />
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
}

.logo {
  display: block;
  margin: 0 auto;
  width: 200px;
}
</style>
