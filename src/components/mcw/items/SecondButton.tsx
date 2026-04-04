const SecondButton = (props) => {
  const {
    children,
    onClick = () => {},
  } = props
  return (
    <button
      onClick={onClick}
      className="w-full py-4 bg-white dark:bg-[#1c1830] border-2 border-wallet-purple text-wallet-purple font-semibold rounded-lg transition-colors text-lg flex items-center justify-center gap-3 hover:bg-wallet-purple hover:text-white"
    >
      {children}
    </button>
  )
}

export default SecondButton