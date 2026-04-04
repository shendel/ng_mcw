import type { AppProps } from "next/app"
import Head from 'next/head'
import getConfig from 'next/config'
import { StorageProvider } from '@/contexts/StorageContext'

import AppRootWrapper from '@/components/AppRootWrapper'
import MCWRouter from './_routing'

import {
  STORAGE_KEYS
} from '@/config'

function MyApp(pageProps) {
  return (
    <>
      <StorageProvider keys={Object.keys(STORAGE_KEYS)} defaults={STORAGE_KEYS}>
        <AppRootWrapper>
          <MCWRouter />
        </AppRootWrapper>
      </StorageProvider>
    </>
  )
}

export default MyApp;
