const SendIcon = (props) => {
  const { size = 5, className = 'text-gray-600 dark:text-gray-300' } = props
  
  return (
    <svg 
      className={`w-${size} h-${size} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}

export default SendIcon