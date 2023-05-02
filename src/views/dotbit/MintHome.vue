<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const hanleClaim = () => {
  router.push('/dotbit/mint')
}

</script>


<template>
  <div class="claim-container">
    <div class="claim-text">
      Mint your free .bit SubDID Of SeeDAO.
    </div>
    <div class="claim-description">
      SubDID is a decentralized identity system that allows you to control your identity information more securely and
      independently in the digital world.
    </div>
    <div class="claim-button" @click="hanleClaim">Claim SubDID</div>
  </div>
</template>

<style scoped>
.claim-container {
  font-family: ui-monospace;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

.claim-text {
  z-index: 1;
  font-style: normal;
  font-weight: 700;
  font-size: 52px;
  line-height: 62px;
  color: white;
  max-width: 900px;
  mix-blend-mode: luminosity;
  text-align: center;
  align-items: center;
  display: flex;
}

.claim-description {
  z-index: 1;
  max-width: 700px;
  color: rgba(255, 255, 255, 0.7);
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 160%;
  margin-top: 16px;
  display: flex;
  align-items: center;
  text-align: center;
}

.claim-button {
  z-index: 1;
  color: #833EF1;
  margin-top: 40px;
  border-radius: 8px;
  padding: 8px 16px;
  margin-right: 8px;
  color: white;
  background: linear-gradient(180deg, #833EF1 0%, #491CB5 100%);
  border-radius: 8px;
  margin-bottom: 40px;
}

.claim-button:hover {
  background: linear-gradient(180deg, #792af8 0%, #5615ec 100%);
  cursor: pointer;
}

.claim-button:active {
  background-color: rgba(131, 62, 241, 0.6);
  cursor: pointer;
}
</style>