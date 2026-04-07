import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useStorage } from '@/contexts/StorageContext'
import { GET_CHAIN_BYID, IS_HAS_MULTICAL } from '@/web3/chains'
import fetchBalancesMC from '@/helpers_mcw/fetchBalancesMC'
import { useBrowserWeb3 } from '@/web3/BrowserWeb3Provider'

const AssetsContext = createContext({
  assets: [],
  assetsBalances: {},
  hiddenAssets: [],
  getAsset: (key) => {},
  getAssetBalance: (key) => {}
});

export const useAssets = () => {
  return useContext(AssetsContext);
};


export default function AssetsProvider({ children }) {
  const { values: storageValues, getValue: getStorageValue } = useStorage()
  const [ assetsList, setAssetsList ] = useState([])
  const [ assets, setAssets ] = useState([])
  const [ assetsBalances, setAssetsBalances ] = useState({})
  
  const [ hiddenAssets, setHiddenAssets ] = useState([])

  const { browserAccount } = useBrowserWeb3()

  const [ assetsNetworks, setAssetsNetworks ] = useState([])
  const [ assetsTokens, setAssetsTokens ] = useState({})
  
  useEffect(() => {
    setAssetsNetworks(getStorageValue('assetNetworks'))
    setAssetsTokens(getStorageValue('assets'))
  }, [ storageValues ])
  
  console.log('>>> browserAccount', browserAccount)
  const getAsset = (key) => {
    return assets.find((asset) => { return key == asset.key })
  }
  useEffect(() => {
    setAssetsList([])

    assetsNetworks.forEach((chainId) => {
      const chainInfo = GET_CHAIN_BYID(chainId)
      if (chainInfo) {
        setAssetsList((prev) => {
          return [
            ...prev,
            {
              key: chainInfo.id,
              chainId: chainInfo.id,
              type: 'NATIVE',
              name: chainInfo.name,
              symbol: chainInfo.nativeCurrency.symbol
            }
          ]
        })
        const tokenContracts = []
        Object.keys(assetsTokens).forEach((key) => {
          if (assetsTokens[key].chainId == chainId) {
            tokenContracts.push(assetsTokens[key].tokenAddress)
            setAssetsList((prev) => {
              return [
                ...prev,
                {
                  key,
                  chainId: assetsTokens[key].chainId,
                  type: 'TOKEN',
                  tokenInfo: assetsTokens[key],
                  name: assetsTokens[key].name,
                  symbol: assetsTokens[key].symbol,
                }
              ]
            })
          }
        })
        if (IS_HAS_MULTICAL(chainId)) {
          fetchBalancesMC({
            chainId,
            accountAddress: browserAccount,
            tokenContracts
          }).then((answer) => {
            setAssetsBalances((prev) => {
              const _ret = {
                ...prev,
                [`${chainId}`]: {
                  normal: Number(answer.balance.normal),
                  wei: answer.balance.wei
                }
              }
              tokenContracts.forEach((key) => {
                _ret[`${chainId}-${key.toLowerCase()}`] = {
                  normal: Number(answer[key].normal),
                  wei: answer[key].wei
                }
              })
              console.log('>>>> NEW', _ret)
              return _ret
            })
            
            console.log('>>>>', answer)
          }).catch((err) => {
            console.log('err', err)
          })
        }
      }
    })
  }, [ assetsNetworks, assetsTokens, browserAccount ])
  
  const updateAssetsList = () => {
    console.log('update assets list', assetsList, assetsBalances)
    setAssets(
      assetsList.map((a) => {
        return {
          ...a,
          isBalanceFetching: !(assetsBalances[a.key]),
          balance: (assetsBalances[a.key])
            ? Number(assetsBalances[a.key].normal)
            : 0
        }
      })
    )
  }
  useEffect(() => {
    updateAssetsList()
  }, [ assetsList, assetsBalances ])
  
  return (
    <AssetsContext.Provider value={{
      assets,
      assetsBalances,
      hiddenAssets,
      getAsset,
      getAssetBalance: (key) => {
        if (assetsBalances[key]) {
          return Number(assetsBalances[key].normal)
        } else {
          return Number(0)
        }
      }
    }}>
      {children}
    </AssetsContext.Provider>
  )
}