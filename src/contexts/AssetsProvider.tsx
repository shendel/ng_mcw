import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useStorage } from '@/contexts/StorageContext'
import { GET_CHAIN_BYID } from '@/web3/chains'

const AssetsContext = createContext({
  assets: [],
  hiddenAssets: [],
  getAsset: (key) => {}
});

export const useAssets = () => {
  return useContext(AssetsContext);
};


export default function AssetsProvider({ children }) {
  const { values: storageValues, getValue: getStorageValue } = useStorage()
  const [ assets, setAssets ] = useState([])
  const [ hiddenAssets, setHiddenAssets ] = useState([])


  const [ assetsNetworks, setAssetsNetworks ] = useState([])
  const [ assetsTokens, setAssetsTokens ] = useState({})
  
  useEffect(() => {
    setAssetsNetworks(getStorageValue('assetNetworks'))
    setAssetsTokens(getStorageValue('assets'))
  }, [ storageValues ])
  
  
  const getAsset = (key) => {
    return assets.find((asset) => { return key == asset.key })
  }
  useEffect(() => {
    const _assets = []

    assetsNetworks.forEach((chainId) => {
      const chainInfo = GET_CHAIN_BYID(chainId)
      if (chainInfo) {
        _assets.push({
          key: chainInfo.id,
          chainId: chainInfo.id,
          type: 'NATIVE',
          name: chainInfo.name,
          symbol: chainInfo.nativeCurrency.symbol,
          amount: 0,
          isBalanceFetching: true,
          usdValue: 0
        })
        Object.keys(assetsTokens).forEach((key) => {
          if (assetsTokens[key].chainId == chainId) {
            _assets.push({
              key,
              chainId: assetsTokens[key].chainId,
              type: 'TOKEN',
              tokenInfo: assetsTokens[key],
              name: assetsTokens[key].name,
              symbol: assetsTokens[key].symbol,
              amount: 0,
              isBalanceFetching: true,
              usdValue: 0
            })
          }
        })
      }
    })
    setAssets(_assets)
  }, [ assetsNetworks, assetsTokens ])
  
  return (
    <AssetsContext.Provider value={{
      assets,
      hiddenAssets,
      getAsset
    }}>
      {children}
    </AssetsContext.Provider>
  )
}