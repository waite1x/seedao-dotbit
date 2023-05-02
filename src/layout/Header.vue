<script setup lang="ts">

import { useUserStore } from '../stores'
import { useRouter } from 'vue-router'

const userSotre = useUserStore()
const router = useRouter()

const connectWallet = async () => {
  if (!userSotre.user?.address) {
    await userSotre.login()
  }
}

const goHome = () => {
  router.push('/')
}

</script>

<template>
  <div class="header">
    <img src="logo-dark.png" @click="goHome" style="height: 100%; cursor: pointer;" />
    <div style="flex: 1;"></div>

    <div class="wallet-button" @click="connectWallet">
      {{ userSotre.user ? userSotre.shortAddress() : 'Connect Wallet' }}
    </div>
  </div>
</template>

<style scoped>
.header {
  z-index: 1;
  width: 100%;
  height: 60px;
  position: absolute;
  top: 0px;
  display: inline-flex;
  flex-flow: row;
  background: linear-gradient(90.18deg, rgba(61, 61, 61, 0.2052) 0%, rgba(29, 29, 29, 0.285) 100%);
  backdrop-filter: blur(10px);
  align-items: center;
}


.wallet-button {
  border: 1px solid rgba(131, 62, 241, 1);
  color: #833EF1;
  border-radius: 8px;
  padding: 8px 16px;
  margin-right: 8px;

}

.wallet-button:hover {
  background-color: rgba(131, 62, 241, 0.4);
  cursor: pointer;
}

.wallet-button:active {
  background-color: rgba(131, 62, 241, 0.6);
  cursor: pointer;
}
</style>
