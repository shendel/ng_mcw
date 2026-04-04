const StepList = (props) => {
  const {
    steps
  } = props
  
  return (
    <div className="bg-gray-100 dark:bg-[#1c1830] rounded-lg p-4 mb-6">
      <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {steps.map((step, index) => {
          return (
            <li className="flex items-start gap-2" key={index}>
              <span className="font-semibold text-wallet-purple">{(index + 1)}.</span>
              <span>{step}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default StepList