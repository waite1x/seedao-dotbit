
<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useUserStore } from '../../stores'
import { Button, Input } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { VerifierName, checkCanMint, getMintSubDIDMessage, checkSubDIDValid, mintSubDID, VerifyMintParam } from '../../api/subdid'
import { useRoute } from 'vue-router';
import { signMessage } from '../../wallet';

enum LogLevel {
  info = 0,
  warning = 1,
  error = 2,
  success = 3,
}

type LogInfo = {
  message: string
  level: LogLevel
}

const userSotre = useUserStore()
const route = useRoute()

const cdkey = ref<string | undefined>()
const subDID = ref<string | undefined>()
const canMint = ref<boolean>(false)
const mintedSudDID = ref<string | undefined>()
const loading = ref<boolean>(false)
const log = ref<LogInfo | undefined>()

const checkUserCanMint = async (address: string): Promise<boolean> => {
  canMint.value = true
  logInfo('Checking can mint...')
  const param: VerifyMintParam = {
    address: address,
  }
  if (cdkey.value) {
    param.cdkey = cdkey.value
  }
  const result = await checkCanMint(param)
  const item = result.find(r => r.success)
  if (item) {
    logSuccess(item.message ?? 'Can mint')
    return true
  } else {
    logError(result[0].message ?? 'Can not mint')
    if (result[0].verifierName === VerifierName.Address) {
      canMint.value = false
      mintedSudDID.value = result[0].data?.subDID
    }
    return false
  }

}

onMounted(async () => {
  const code = route.query.code as string
  if (code) {
    cdkey.value = code
  }

  if (!userSotre.user) {
    await userSotre.login()
  }
  loading.value = true
  try {
    await checkUserCanMint(userSotre.user?.address!)
  } finally {
    loading.value = false
  }
})

const handleMintSubDID = async () => {
  loading.value = true
  try {

    if (!userSotre.user?.address) {
      logError('Please connect wallet first')
      return
    }
    if (!subDID.value) {
      logError('Please input SubDID')
      return
    }
    const address = userSotre.user.address
    const subdid = subDID.value
    const userCanMint = await checkUserCanMint(address)
    if (!userCanMint) {
      return
    }
    const result = await checkSubDID(address, subdid)
    if (!result.success) {
      logError(result.message ?? 'SubDID is invalid')
      return
    }
    const sign = await signMintMessage(userSotre.user.address, subdid)
    const mintResult = await mintSubDID({
      address,
      subDID: subdid,
      signature: sign,
      cdkey: cdkey.value,
    })

    if (!mintResult.success) {
      logError(mintResult.message ?? 'Mint failed')
    } else {
      logClear()
      mintedSudDID.value = subdid
    }
  } finally {
    loading.value = false
  }
}

const signMintMessage = async (address: string, subDID: string) => {
  logInfo('Signing mint message...')
  const message = await getMintSubDIDMessage({
    address,
    subDID
  })
  const sign = await signMessage(message.signMessage, address)
  logClear()
  return sign
}

const checkSubDID = async (address: string, subDID: string) => {
  logInfo('Checking SubDID is valid...')
  const result = await checkSubDIDValid(address, subDID)
  logClear()
  return result
}

const logError = (message: string) => {
  log.value = {
    message,
    level: LogLevel.error,
  }
}

const logInfo = (message: string) => {
  log.value = {
    message,
    level: LogLevel.info,
  }
}

const logSuccess = (message: string) => {
  log.value = {
    message,
    level: LogLevel.success,
  }
}

const logClear = () => {
  log.value = undefined
}


</script>

<template>
  <div class="mint-root">
    <div class="text-container">
      <div class="mint-text">
        <img style="height: 100px;" src="logo-dark.png" />
        <span>🗙</span>
        <img style="height: 40px; margin-left: 20px;" src="dotbit-logo-light.svg" />
      </div>
      <div class="mint-description">
        By Minting your SubDID from SeeDAO, you'll have a powerful tool to verify your identity across multiple
        platforms, as well as access to the SeeDAO ecosystem, where you can participate in exciting decentralized
        applications and earn rewards for your contributions.
      </div>
    </div>
    <div class="mint-container">
      <div class="mint-title">Mint SeeDAO SubDID</div>
      <div class="mint-address">
        <span class="label-text">Wallet:</span>
        <span class="text-link" >
          {{ userSotre.user ? userSotre.shortAddress(20) : 'Not Connected Wallet' }}
        </span>
      </div>
      <div class="cdkey-row">
        <span class="label-text">Mint Code:</span>
        <Input v-model:value="cdkey" size="large" placeholder="Enter your mint code" width="60px" />
      </div>
      <div class="subdid-row">
        <span class="label-text">SubDID:</span>
        <Input v-model:value="subDID" placeholder="example subDID" />
        <span>.seedao.bit</span>
      </div>
      <div class="log-row" :class="{
          'warning-text': log?.level == LogLevel.warning,
          'error-text': log?.level == LogLevel.error,
          'success-text': log?.level == LogLevel.success,
        }">
        {{ log?.message }}
      </div>
      <div class="minted-row">Minted SubDID:
        <span class="text-link" style="margin:0 8px;">{{ mintedSudDID }}</span>
      </div>
      <div class="mint-footer">
        <Button class="claim-button" :disabled="!canMint || loading">
          <LoadingOutlined v-if="loading" />
          <span class="text-link" @click="handleMintSubDID">Mint</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mint-root {
  z-index: 1;
  display: flex;
  flex-wrap: wrap-reverse;
  overflow: auto;
}

.label-text {
  width: 100px;
  display:inline-block;
}

.mint-text {
  z-index: 1;
  font-style: normal;
  font-weight: 700;
  font-size: 52px;
  line-height: 62px;
  color: rgb(210, 210, 210);
  max-width: 900px;
  mix-blend-mode: luminosity;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
}

.mint-description {
  max-width: 700px;
  color: rgba(255, 255, 255, 0.7);
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 160%;
  margin-top: 16px;
  display: flex;
  align-items: center;
  text-align: center;
}

.text-container {
  color: rgb(184, 184, 184);
  max-width: 800px;
  margin: 20px;
  padding: 20px;
}

.mint-container {
  font-size: 18px;
  max-width: 600px;
  background: #121212fd;
  backdrop-filter: blur(20px);
  color: rgb(210, 210, 210);
  display: flex;
  flex: 1;
  flex-flow: column;
  border-radius: 10px;
  margin: 20px;
}

.warning-text {
  color: rgb(172, 172, 13);
}

.error-text {
  color: #f54949fb;
}

.success-text {
  color: #0cf04dfb;
}

.mint-title {
  background: #22222298;
  font-size: 30px;
  font-weight: 700;
  padding: 16px;
  margin-bottom: 24px;
}

.mint-address {
  line-height: 50px;
  padding: 0 24px;
}

.log-row {
  line-height: 50px;
  padding: 0 24px;
  height: 80px;
  display: inline-flex;
  align-items: center;
  font-size: 16px;
}

.check-row {
  line-height: 50px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
}

.cdkey-row {
  line-height: 60px;
  padding: 0 24px;
}

.cdkey-row .ant-input {
  width: 200px;
}

.subdid-row {
  line-height: 60px;
  padding: 0 24px;
}

.subdid-row .ant-input {
  font-size: 18px;
  width: 140px;
  padding: 0 6px;
  text-align: end;
}

.minted-row {
  line-height: 50px;
  padding: 0 24px;
  font-size: 16px;
}

.mint-footer {
  display: flex;
  justify-content: center;
}

.claim-button {
  z-index: 1;
  width: auto;
  margin-top: 20px;
  border-radius: 8px;
  padding: 8px 66px;
  height: fit-content;
  color: rgb(210, 210, 210);
  border-radius: 6px;
  margin-bottom: 20px;
}

.disabled {
  background: #6c6c6cba;
  cursor: not-allowed;
}
</style>