import CheckMarkIcon from '@/components/mcw/icons/CheckMarkIcon'

const LabelWithCheck = ({children}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
        <CheckMarkIcon />
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{children}</span>
    </div>
  )
}
export default LabelWithCheck