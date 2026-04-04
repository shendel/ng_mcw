import { useRouter } from "next/router"
import { useEffect, useState, createContext, useContext } from "react"
import React from "react"

const HashRouterContext = createContext({
  params: [],
  hash: '/',
  setParams: () => {},
  setHash: () => {}
})

export const useHashRouterContext = () => {
  return useContext(HashRouterContext)
}

export default function HashRouterProvider(props) {
  const {
    children
  } = props

  const [ params, setParams ] = useState([])
  const [ hash, setHash ] = useState('/')
  
  return <HashRouterContext.Provider
    value={{
      params,
      setParams,
      hash,
      setHash
    }}
  >
    {children}
  </HashRouterContext.Provider>
}