import { ethers } from 'ethers'


const MainnetChainId = 1; // Mainnet
// const GoerliChainId = 5; // Goerli
// const PolygonChainId = 137; // Polygon

let provider: any | undefined

const toHex = (num: number) => `0x${num.toString(16)}`

export async function requestAccount(): Promise<string> {
  const p = getProvider()
  await checkAndSwitchChain(MainnetChainId)
  const accounts: string[] = await p.request({
    method: 'eth_requestAccounts',
  })
  return accounts[0]
}

export async function switchChain(chainId: number) {
  const p = getProvider()
  await p.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: toHex(chainId) }],
  })
}

export async function checkAndSwitchChain(chainId: number = MainnetChainId) {
  const p = getProvider()
  const chainIdHex = await p.request({
    method: 'eth_chainId',
  })
  const currentChianId = parseInt(chainIdHex, 16)
  if (currentChianId !== chainId) {
    switchChain(chainId)
  }
}

export async function signMessage(message: string, from: string): Promise<string> {
  const p = getProvider()
  debugger
  await checkAndSwitchChain(MainnetChainId)
  const sign: string = await p.request({
    method: 'personal_sign',
    params: [message, from],
  })
  return sign
}

export function getShortAddress(address: string | undefined, prefixNum: number = 6) {
  const max = prefixNum + 4
  return address ? (address.length > max ? `${address.slice(0, prefixNum)}...${address.slice(address.length - 4, address.length)}` : address) : ''
}

function getProvider() {
  if (provider === undefined) {
    // const sdk = new MetaMaskSDK()
    // provider = sdk.getProvider()
    const w = window as any
    provider = w.ethereum
  }
  if (provider === undefined) {
    throw new Error('Please install MetaMask!')
  }
  return provider
}

const getSigner = () => {
  const p = getProvider()
  const provider = new ethers.BrowserProvider(p)
  return provider.getSigner()
}
