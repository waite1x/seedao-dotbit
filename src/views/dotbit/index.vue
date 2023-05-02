<script setup lang="ts">
</script>

<template>
  <div class="root">
    <img class="animation_bg" src="dotbit_bg_bottom.png" />
    <router-view></router-view>
  </div>
</template>

<style scoped>
.root {
  background-image: url('/dotbit_bg.png');
  background-size: cover;
  position: relative;
  height: 100% ;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  padding-top: 60px;
}

.animation_bg {
  position: absolute;
  bottom: 0;
  width: 70%;
  text-align: center;
  left: 50%;
  transform: translate(-50%, 0%);
  /* 50%为自身尺寸的一半 */
  -webkit-transform: translate(-50%, 0%);
  /* left: calc(50% - width / 2); */
  background-size: auto;
  /* transform: matrix(-0.97, 0.26, 0.26, 0.97, 0, 0); */
}
</style>