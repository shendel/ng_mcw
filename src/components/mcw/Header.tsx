import { useState, useEffect, useRef } from 'react'

import PopupMenu from '@/components/mcw/items/PopupMenu'
import HeaderThemeSwitcher from './Header/ThemeSwitcher'
import HeaderAccountsBlock from './Header/AccountsBlock'
import HeaderNetworksBlock from './Header/NetworksBlock'
import HeaderBackIcon from '@/components/mcw/icons/HeaderBackIcon'
import HeaderMenuIcon from '@/components/mcw/icons/HeaderMenuIcon'

const Header = (props) => {
  const {
    logo = false,
    wallets = false,
    networks = false,
    title = false,
    titleCenter = false,
    theme = false,
    backButton = false,
    onBackClick = () => {},
    menuButton = false,
    menuItems = []
  } = props
  
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0, direction: 'down' })
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false)
      }
    }

    if (isMenuVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuVisible])

  useEffect(() => {
    if (isMenuVisible && menuButtonRef) {
      
      const button = menuButtonRef.current
      const rect = button.getBoundingClientRect()
      const menuRect = menuRef.current.getBoundingClientRect()
      const menuHeight = menuRect.height
      const gap = 0

      const spaceBelow = window.innerHeight - rect.bottom
      const direction = spaceBelow < menuHeight + gap ? 'up' : 'down'

      setMenuPosition({
        top: direction === 'down' ? rect.bottom + gap : rect.top - menuHeight - gap,
        right: window.innerWidth - rect.right,
        direction,
      })
    }
  }, [ isMenuVisible ])
  
  const openMenu = (event) => {
    event.stopPropagation()
    setIsMenuVisible(true)
  }


  return (
    <>
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
          {backButton && (
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors" onClick={onBackClick}>
              <HeaderBackIcon />
            </button>
          )}
          {title && (
            <h1
              className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${(titleCenter) ? 'text-center w-full' : ''}`}
            >{title}</h1>
          )}
          {(wallets || networks) && (
            <div className="flex w-full items-center gap-2">
              {wallets && (
                <HeaderAccountsBlock />
              )}
              
              {networks && (
                <HeaderNetworksBlock />
              )}
            </div>
          )}
          {theme && (
            <HeaderThemeSwitcher />
          )}
          {menuButton && (
            <button
              onClick={openMenu}
              ref={menuButtonRef}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <HeaderMenuIcon />
            </button>
          )}
        </div>
      </header>
      {isMenuVisible && (
        <>
          <PopupMenu
            menuRef={menuRef}
            top={menuPosition.top}
            right={menuPosition.right}
            items={menuItems.map((menuItem) => {
              return {
                title: menuItem.title,
                onClick: () => {
                  setIsMenuVisible(false)
                  menuItem.onClick()
                }
              }
            })}
          />
        </>
      )}
    </>
  )
}

export default Header