const Toggle = (props) => {
  const {
    options = {},
    value,
    onChange = () => {},
  } = props
  
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-gray-100 dark:bg-[#1c1830] p-1 rounded-lg flex">
        {Object.keys(options).map((v) => {
          return (
            <button 
              key={v}
              onClick={() => { onChange(v) }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${v == value ? 'bg-white dark:bg-gray-600 shadow text-wallet-purple' : 'text-gray-500'}`}
            >
              {options[v]}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Toggle