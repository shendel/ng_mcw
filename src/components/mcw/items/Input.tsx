import React from 'react'

/**
 * Input Component
 * @param {Object} props
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.hasError - Error state
 * @param {string} props.errorMessage - Error message (optional)
 * @param {string} props.type - Input type (default: 'text')
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.label - Label text (optional)
 * @param {React.ReactNode} props.leftIcon - Left icon (optional)
 * @param {React.ReactNode} props.rightIcon - Right icon (optional)
 */
const Input = (props) => {
  const {
    value,
    onChange,
    disabled = false,
    hasError = false,
    errorMessage,
    type = 'text',
    placeholder,
    className = '',
    label,
    leftIcon,
    rightIcon,
    ...restProps
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
  `

  const stateClasses = hasError
    ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20'
    : 'border-gray-200 dark:border-white/10 focus:ring-wallet-purple/20 focus:border-wallet-purple'

  const finalClasses = `${baseClasses} ${stateClasses} ${className}`.trim()

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          value={value}
          onChange={(e) => { onChange(e.target.value) }}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            ${finalClasses}
            ${leftIcon ? 'pl-12' : ''}
            ${rightIcon ? 'pr-12' : ''}
          `}
          {...restProps}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error Message */}
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

export default Input