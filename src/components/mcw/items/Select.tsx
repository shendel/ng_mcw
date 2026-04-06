const Select = (props) => {
  const {
    value = 0,
    onChange = () => {},
    items = [],
    label = false,
    hasError = false,
    errorMessage,
  } = props
  
  const baseClasses = `
    w-full px-4 py-3 
    bg-white dark:bg-[#14121e] 
    border rounded
    text-gray-900 dark:text-gray-100 
    placeholder-gray-400 dark:placeholder-gray-500 
    focus:outline-none focus:ring-2 
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    appearance-none cursor-pointer
  `

  const stateClasses = hasError
    ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20'
    : 'border-gray-200 dark:border-white/10 focus:ring-wallet-purple/20 focus:border-wallet-purple'

  const finalClasses = `${baseClasses} ${stateClasses}`.trim()
//"w-full px-4 py-3 bg-white dark:bg-[#14121e] border border-gray-200 dark:border-white/10 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-wallet-purple appearance-none cursor-pointer"
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select className={finalClasses} value={value} onChange={(e) => { onChange(e.target.value) }}>
          {items.map(({ value, title }) => {
            return (
              <option key={value} value={value}>{title}</option>
            )
          })}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
      {hasError && errorMessage && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMessage}
        </p>
      )}
  </div>
  )
}


export default Select