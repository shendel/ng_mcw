const ReceiveIcon = (props) => {
  const { size = 5, className = 'text-gray-600 dark:text-gray-300' } = props
  
  return (
    <svg 
      className={`w-${size} h-${size} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

export default ReceiveIcon