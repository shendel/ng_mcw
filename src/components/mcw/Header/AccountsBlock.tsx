import { useEffect, useState } from 'react'
import { useStorage } from '@/contexts/StorageContext'
import { getShortAddress } from '@/helpers/etherscan'
import AccountModal from '@/views/modals/AccountModal'
import { useModal } from '@/contexts/ModalContext'

const HeaderAccountsBlock = (props) => {
  const { values: storageData, getValue } = useStorage()
  const { openModal, closeModal } = useModal()
  
  const accounts = getValue('accounts')
  const activeAccount = getValue('activeAccount')
  
  const accountData = accounts?.[activeAccount] || false
  
  const handleSelectAccount = (account) => {
    console.log('select account', account)
    alert(`Аккаунт активирован: ${account.name}`);
  };

  const handleAddAccount = () => {
    alert('Открыть форму создания нового аккаунта');
  };

  const handleImportAccount = () => {
    alert('Открыть форму импорта аккаунта');
  };

  const handleEditAccount = (account) => {
    alert(`Редактировать: ${account.name}`);
  };

  const handleDeleteAccount = (account) => {
    console.log('delete account', account)
    
  };

  const handleExportAccount = (account) => {
    alert(`Экспорт аккаунта: ${account.name}`);
  };

  const handleShowKeys = (account) => {
    const confirmed = window.confirm(`Показать приватный ключ для ${account.name}?\n\n⚠️ Никогда не передавайте ключ третьим лицам!`);
    if (confirmed) {
      alert(`Приватный ключ для ${account.name}:\n0x1234567890abcdef... (demo)`);
    }
  };

  const activeAccountId = accountData?.id
  
  const handleOpenAccounts = () => {
    openModal({
      id: 'ACCOUNTS_MODAL',
      onlyLayer: true,
      onBgClick: () => { closeModal('ACCOUNTS_MODAL') },
      content: (
        <AccountModal
          isOpen={true}
          onClose={() => { closeModal('ACCOUNTS_MODAL') }}
          accounts={accounts}
          activeAccountId={activeAccountId}
          onSelectAccount={handleSelectAccount}
          onAddAccount={handleAddAccount}
          onImportAccount={handleImportAccount}
          onEditAccount={handleEditAccount}
          onDeleteAccount={handleDeleteAccount}
          onExportAccount={handleExportAccount}
          onShowKeys={handleShowKeys}
        />
      )
    })
  }
  return (
    <>
      <button
        onClick={handleOpenAccounts}
        className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full px-3 py-1.5 transition-colors"
      >
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {accountData ? (
            <>{getShortAddress(accountData.address)}</>
          ) : (
            <>{`...`}</>
          )}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </>
  )
}

export default HeaderAccountsBlock