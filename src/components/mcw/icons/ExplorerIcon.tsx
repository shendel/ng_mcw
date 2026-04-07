const ExplorerIcon = (props) => {
  const { size = 5, className = 'text-gray-600 dark:text-gray-300' } = props
  
  return (
    <svg 
      className={`w-${size} h-${size} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
      />
    </svg>
  )
}

export default ExplorerIcon