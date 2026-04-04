const CloseIcon = (props) => {
  const { size = 5 } = props
  
  return (
    <svg className={`w-${size} h-${size} textray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
    </svg>
  )
}

export default CloseIcon