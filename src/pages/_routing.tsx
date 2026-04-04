import Home from '@/views/Home'
import Welcome from '@/views/Welcome'

import Page404 from '@/pages/404'
import HashRouterViews from '@/components/HashRouterViews'
import { useStorage } from '@/contexts/StorageContext'

const MCWRouter = (props) => {
  const { getValue } = useStorage()

  const accounts = getValue('accounts')
  
  console.log('>>> storage', accounts)
  const viewsPaths = {
    '/': (accounts?.length == 0) ? Welcome : Home,
    '/welcome': Welcome,
  }

  return (
    <HashRouterViews
      views={{
        ...viewsPaths,
      }}
      props={{
      }}
      on404={Page404}
    />
  )
}

export default MCWRouter