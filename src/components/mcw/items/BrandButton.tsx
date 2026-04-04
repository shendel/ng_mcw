const BrandButton = (props) => {
  const {
    children, 
    onClick = () => {},
  } = props
  return (
    <button
      onClick={onClick}
      className="w-full py-4 bg-wallet-purple hover:bg-wallet-purple-hover text-white font-semibold rounded-lg transition-colors text-lg flex items-center justify-center gap-3"
    >
      {children}
    </button>
  )
}

export default BrandButton
  
