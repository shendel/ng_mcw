import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/mcw/items/Button'
import AddIcon from '@/components/mcw/icons/AddIcon'
import ImportIcon from '@/components/mcw/icons/ImportIcon'
import EditIcon from '@/components/mcw/icons/EditIcon'
import KeysIcon from '@/components/mcw/icons/KeysIcon'
import ExportIcon from '@/components/mcw/icons/ExportIcon'
import DeleteIcon from '@/components/mcw/icons/DeleteIcon'
import CheckMarkIcon from '@/components/mcw/icons/CheckMarkIcon'
import CloseIcon from '@/components/mcw/icons/CloseIcon'
import PopupMenu from '@/components/mcw/items/PopupMenu'

/**
 * Account Modal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility state
 * @param {Function} props.onClose - Close modal callback
 * @param {Array} props.accounts - Array of account objects
 * @param {string} props.activeAccountId - Currently active account ID
 * @param {Function} props.onSelectAccount - Account selection callback
 * @param {Function} props.onAddAccount - Add new account callback
 * @param {Function} props.onImportAccount - Import account callback
 * @param {Function} props.onEditAccount - Edit account callback
 * @param {Function} props.onDeleteAccount - Delete account callback
 * @param {Function} props.onExportAccount - Export account callback
 * @param {Function} props.onShowKeys - Show private keys callback
 */
const AccountModal = (props) => {
  const {
    isOpen,
    onClose,
    accounts = [],
    activeAccountId,
    onSelectAccount,
    onAddAccount,
    onImportAccount,
    onEditAccount,
    onDeleteAccount,
    onExportAccount,
    onShowKeys,
  } = props
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0, direction: 'down' });
  const [activeMenuAccountId, setActiveMenuAccountId] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const modalRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false);
        setActiveMenuAccountId(null);
      }
    };

    if (isMenuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuVisible]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isMenuVisible) {
          setIsMenuVisible(false);
          setActiveMenuAccountId(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isMenuVisible, onClose]);

  // Reset menu state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsMenuVisible(false);
      setActiveMenuAccountId(null);
    }
  }, [isOpen]);

  // Calculate menu position
  const openMenu = (event, accountId) => {
    event.stopPropagation();
    
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const menuHeight = 220; // Approximate menu height
    const gap = 8;

    // Calculate if menu should open up or down
    const spaceBelow = window.innerHeight - rect.bottom;
    const direction = spaceBelow < menuHeight + gap ? 'up' : 'down';

    setMenuPosition({
      top: direction === 'down' ? rect.bottom + gap : rect.top - menuHeight - gap,
      right: window.innerWidth - rect.right,
      direction,
    });

    setActiveMenuAccountId(accountId);
    setIsMenuVisible(true);
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
    setActiveMenuAccountId(null);
  };

  const handleMenuAction = (action) => {
    const account = accounts.find(a => a.id === activeMenuAccountId);
    if (!account) return;

    switch (action) {
      case 'edit':
        onEditAccount?.(account);
        break;
      case 'showKeys':
        onShowKeys?.(account);
        break;
      case 'export':
        onExportAccount?.(account);
        break;
      case 'delete':
        const confirmed = window.confirm(`Удалить аккаунт "${account.name}"?\n\nЭто действие нельзя отменить!`);
        if (confirmed) {
          onDeleteAccount?.(account);
        }
        break;
      default:
        break;
    }

    closeMenu();
  };

  const handleSelectAccount = (account) => {
    onSelectAccount?.(account);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 pointer-events-none">
        <div 
          ref={modalRef}
          className="w-full max-w-md bg-white dark:bg-[#1c1830] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[80vh] pointer-events-auto animate-slide-down"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Аккаунты</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Accounts List */}
          <div className="overflow-y-auto custom-scroll p-2 space-y-2 flex-1">
            {accounts.map((account) => {
              const isActive = account.id === activeAccountId;
              
              return (
                <div key={account.id} className="group relative">
                  <div
                    onClick={() => handleSelectAccount(account)}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                      ${isActive 
                        ? 'bg-wallet-purple/10 dark:bg-wallet-purple/20 border-2 border-wallet-purple' 
                        : 'bg-white dark:bg-[#14121e] border-2 border-gray-200 dark:border-white/10 hover:border-wallet-purple'
                      }
                    `}
                  >
                    {/* Avatar */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${account.avatarColor || 'bg-gradient-to-br from-purple-400 to-purple-600'}
                    `}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                          {account.name}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 bg-wallet-purple text-white text-xs font-medium rounded-full whitespace-nowrap">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5 truncate">
                        {account.address}
                      </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isActive && (
                        <CheckMarkIcon size={5} />
                      )}
                      
                      <button
                        onClick={(e) => openMenu(e, account.id)}
                        className="p-1.5 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors z-20 relative"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {accounts.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Нет аккаунтов</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-3 border-t border-gray-200 dark:border-white/10 space-y-2 flex-shrink-0 bg-white dark:bg-[#1c1830]">
            <Button onClick={onAddAccount} fullWidth={true}>
              <AddIcon />
              {`Добавить аккаунт`}
            </Button>
            <Button variant="outline" fullWidth={true} onClick={onImportAccount}>
              <ImportIcon />
              {`Импортировать аккаунт`}
            </Button>
          </div>
        </div>
      </div>

      {/* Global Menu (Positioned via JS, outside modal to avoid overflow clipping) */}
      {isMenuVisible && (
        <>
        <PopupMenu
          menuRef={menuRef}
          top={menuPosition.top}
          right={menuPosition.right}
          items={[
            {
              title: (<><EditIcon size={4} />{`Edit`}</>),
              onClick: () => handleMenuAction('edit')
            },
            {
              title: (<><KeysIcon size={4} />{`Show keys`}</>),
              onClick: () => handleMenuAction('showKeys')
            },
            {
              title: (<><ExportIcon size={4} />{`Export`}</>),
              onClick: () => handleMenuAction('export'),
            },
            { type: 'seperator' },
            {
              title: (<><DeleteIcon size={4} />{`Delete`}</>),
              onClick: () => handleMenuAction('delete'),
              red: true
            }
          ]}
        />
        </>
      )}
    </>
  );
};

export default AccountModal