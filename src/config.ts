import getConfig from 'next/config'
import NETWORKS from '@/constants/NETWORKS'

const { publicRuntimeConfig } = getConfig()
const { NEXT_PUBLIC_PROJECT_ID } = publicRuntimeConfig

export const TITLE = publicRuntimeConfig?.TITLE || 'MCWallet'
export const SEO_DESC = publicRuntimeConfig?.SEO_DESC || ""

export const STORAGE_KEYS = {
  theme: 'light',
  accounts: [],
  activeAccount: 0,
  activeNetwork: 97,
  assetNetworks: [1, 56, 97],
  networks: Object.keys(NETWORKS).map((key) => { return NETWORKS[key] }),
  assets: { /* token-add-chain-id.toLower */ },
}