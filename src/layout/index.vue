<script setup lang="ts">
import Header from './Header.vue'
</script>

<template>
  <div class="root-container">
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.root-container{
  height: 100%;
  width: 100%;
}
</style>