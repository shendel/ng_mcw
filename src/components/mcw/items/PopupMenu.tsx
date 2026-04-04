
const PopupMenu = (props) => {
  const {
    menuRef = null,
    top = 0,
    right = 0,
    items = []
  } = props
  
  return (
    <div
      ref={menuRef}
      className="fixed z-[150] w-56 bg-white dark:bg-[#1c1830] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-scale-in"
      style={{
        top: `${top}px`,
        right: `${right}px`,
      }}
    >
      {items.map((item, index) => {
        if (item?.type == 'seperator') {
          return (
            <div key={index} className="border-t border-gray-200 dark:border-white/10 my-1"/>
          )
        } else {
          const { onClick, title, red = false } = item
          const className = (red)
            ? "w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
            : "w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center gap-2 transition-colors"
          return (
            <button
              key={index}
              onClick={onClick}
              className={className}
            >
              {title}
            </button>
          )
        }
      })}
    </div>
  )
}

export default PopupMenu