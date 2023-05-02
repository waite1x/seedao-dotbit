
const baseUrl = 'http://localhost:3000/api'

const canMintApi = '/dotbit/subdid/can-mint'
const checkSubDIDValidApi = '/dotbit/subdid/check-valid'
const getSubDIDSignMsgApi = '/dotbit/subdid/mint-sign-msg'
const mintSubDIDApi = '/dotbit/subdid/mint'

export type VerifyMintParam = {
  address: string,
  [key: string]: any
}

export enum VerifierName {
  Address = 'address',
  CDKEY = 'cdkey',
  SGN = 'sgn',
}

export type VerifyMintResult = {
  success: boolean,
  verifierName: VerifierName,
  message?: string,
  data?: { [key: string]: any },
}

export type MitSubDIDParam = {
  // 钱包地址
  address: string,
  // subDID 的名称 ，比如：'test'，不包含 seedao.bit
  subDID: string,
}

export type MintSubDIDInput = MitSubDIDParam & {
  // 包含了 subDID 的签名
  signature: string,
  [key: string]: any
}

export type MintSubDIDResult = {
  hash?: string,
  success: boolean,
  message?: string,
}


export async function checkCanMint(param: VerifyMintParam): Promise<VerifyMintResult[]> {
  const queryParam = new URLSearchParams(param)
  const url = `${baseUrl}${canMintApi}?${queryParam.toString()}`
  const response = await fetch(url, {
    method: 'GET',
  })
  const result = await response.json()
  return result
}


export async function checkSubDIDValid(address: string, subDID: string): Promise<VerifyMintResult> {
  const url = `${baseUrl}${checkSubDIDValidApi}?address=${address}&subDID=${subDID}`
  const response = await fetch(url, {
    method: 'GET',
  })
  const result = await response.json()
  return result
}

export async function getMintSubDIDMessage(param: MitSubDIDParam): Promise<{ signMessage: string }> {
  const url = `${baseUrl}${getSubDIDSignMsgApi}`
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(param),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const result = await response.json()
  return result
}


export async function mintSubDID(param: MintSubDIDInput): Promise<MintSubDIDResult> {
  const url = `${baseUrl}${mintSubDIDApi}`
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(param),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const result = await response.json()
  return result
}
