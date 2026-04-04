const StepProgress = (props) => {
  const {
    current = 1,
    total = 4
  } = props
  
  return (
    <div className="px-4 py-3">
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => i + 1).map((step) => {
          return (
            <div key={step} className={`flex-1 h-1 ${(step <= current) ? 'bg-wallet-purple' : 'bg-gray-200 dark:bg-gray-700'} rounded`}></div>
          )
        })}
      </div>
    </div>
  )
}

export default StepProgress