const HeaderBackIcon = (props) => {
  const { size = 5 } = props
  
  return (
    <svg className={`w-${size} h-${size} text-gray-600 dark:text-gray-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
    </svg>
  )
}

export default HeaderBackIcon