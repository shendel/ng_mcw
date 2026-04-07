import chainIcons from './'
import DefaultIcon from '@/components/mcw/icons/ChainIcon'

const ChainIcon = (props) => {
  const { chainId, size = 5 } = props
  
  return (
    <div className={`w-${size} h-${size}`}>
      {(chainIcons[chainId]) ? (
        <img src={chainIcons[chainId].src} />
      ) : (
        <div className={`w-${size} h-${size} rounded flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600`}>
          <DefaultIcon size={(size - 2)} />
        </div>
      )}
    </div>
  )
}

export default ChainIcon