const CheckMarkIcon = (props) => {
  const { size = 4 } = props
  
  return (
    <svg className={`w-${size} h-${size} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
    </svg>
  )
}
export default CheckMarkIcon