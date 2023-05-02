import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getShortAddress, requestAccount } from '../wallet'

export interface UserInfo {
  address: string
}

export const useUserStore = defineStore("user", () => {
  const user = ref<UserInfo | undefined>(undefined)

  async function login() {
    const addr = await requestAccount()
    user.value = {
      address: addr
    }
  }

  function shortAddress(prefixNum: number = 6) {
    return getShortAddress(user.value?.address, prefixNum)
  }

  return { user, login, shortAddress }
})
