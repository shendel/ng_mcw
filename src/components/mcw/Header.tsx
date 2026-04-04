import HeaderThemeSwitcher from './Header/ThemeSwitcher'
import HeaderAccountsBlock from './Header/AccountsBlock'


const Header = (props) => {
  const {
    logo = false,
    wallets = false,
    title = false,
    theme = false
  } = props
  
  
  return (
    <header className="bg-white/80 dark:bg-[#1c1830]/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
            {logo && (
              <div className="flex items-center gap-2">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M6 6 L16 4 L16 28 L6 26 Z" fill="#7c5cfc"/>
                      <path d="M16 4 L26 6 L26 10 L16 8 Z" fill="#a78bfa"/>
                      <path d="M6 14 L16 12 L26 14 L16 16 Z" fill="#c4b5fd"/>
                      <path d="M16 16 L26 18 L26 28 L16 28 Z" fill="#7c5cfc"/>
                  </svg>
              </div>
            )}
            {title && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
            )}
            {wallets && (
              <HeaderAccountsBlock />
            )}

            {theme && (
              <HeaderThemeSwitcher />
            )}
        </div>
    </header>
  )
}

export default Header