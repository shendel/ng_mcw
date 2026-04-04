import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useState, useEffect } from "react";

// Создаем контекст для модального окна
const ModalContext = createContext({
  openModal: () => {},
  closeModal: () => {}
});

// Хук для доступа к контексту
export const useModal = () => {
  return useContext(ModalContext);
};

// Компонент модального окна
export default function ModalProvider({ children }) {
  const [modals, setModals] = useState([]); // Массив всех открытых окон

  // Функция для открытия модального окна
  const openModal = (options) => {
    const newModal = {
      id: options.id || Date.now(), // Уникальный ID для каждого окна
      title: options.title || "Confirm Action",
      onlyLayer: options.onlyLayer || false,
      description: options.description || "Are you sure?",
      okTitle: options.okTitle || "Confirm",
      onBgClick: options.onBgClick || function () {},
      cancelTitle: options.cancelTitle || "Cancel",
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null,
      isAlert: options.isAlert || false,
      alertStyle: options.alertStyle || false,
      content: options.content || null,
      hideBottomButtons: options.hideBottomButtons || false,
      hideCloseButton: options.hideCloseButton || false,
      fullWidth: options.fullWidth || false,
      onClose: options.onClose || false
    };
    setModals((prev) => [...prev, newModal]); // Добавляем новое окно в массив
  };

  // Функция для закрытия конкретного модального окна
  const closeModal = (id, callbacks = {}) => {
    const { doCancel, doConfirm, data = false } = callbacks;

    setModals((prev) =>
      prev.filter((modal) => {
        if (modal.id === id) {
          if (modal.onClose) modal.onClose(data)
          if (doConfirm && modal.onConfirm) modal.onConfirm(data);
          if (doCancel && modal.onCancel) modal.onCancel(data);
          return false; // Удаляем окно из массива
        }
        return true;
      })
    );
  };

  
  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* Анимированный показ/скрытие модальных окон */}
      <AnimatePresence>
        {modals.map((modal) => {
          const bgClass = (modal.alertStyle) ? `bg-red-50 border-red-200` : `bg-gray-800 border-gray-700`
          const textClass = (modal.alertStyle) ? `text-red-800`: `text-white`
          return (
            <motion.div
              key={modal.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ zIndex: 2000 }}
              onClick={modal.onBgClick}
              className={`
                ${((modal.fullWidth) ? 'overflow-y-auto' : 'items-center flex')}
                fixed inset-0 bg-black/80 backdrop-blur-sm z-50 justify-center p-4
                `}
            >
              
              {modal.onlyLayer ? (
                <>
                  {/* Только слой - отрисовка своя */}
                  {modal.content}
                </>
              ) : (
                <>
              {/* Основной контейнер модального окна */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ top: '5em' }}
                    className={`
                      relative w-full ${(modal.fullWidth) ? 'max-w-4xl m-auto' : 'max-w-md'} bg-slate-900 border border-slate-800 rounded shadow-2xl overflow-hidden animate-fade-in-up
                        `}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                    {/* Заголовок */}
                    <div className="flex justify-between items-center p-6 pb-2 pt-4">
                      <h3 className="text-xl font-bold text-white tracking-wide">{modal.title}</h3>
                      {!modal.hideCloseButton && (
                        <button 
                          onClick={() => closeModal(modal.id)}
                          className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {modal.content == null ? (
                      <div className={`${textClass} text-center  text-sm text-slate-500 font-medium uppercase tracking-wider`}>
                        {modal.description}
                      </div>
                    ) : (
                      <div>{modal.content}</div>
                    )}

                    {!modal.hideBottomButtons && (
                      <>
                        {modal.isAlert ? (
                          <div className="grid place-items-center p-4">
                            <button
                              onClick={() => closeModal(modal.id, { doConfirm: true })}
                              className="w-full py-2 px-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded shadow-lg shadow-indigo-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                {modal.okTitle || "Confirm"}
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-4 p-4">
                            <button
                              onClick={() => closeModal(modal.id, { doConfirm: true })}
                              className="w-full py-2 px-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded shadow-lg shadow-indigo-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                {modal.okTitle || "Confirm"}
                            </button>
                            <button
                              onClick={() => closeModal(modal.id, { doCancel: true })}
                              className="w-full py-2 px-2 bg-gradient-to-r from-red-900/80 to-red-800 border border-red-900/50 hover:bg-red-800 hover:border-red-700 text-red-100 font-semibold rounded transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {modal.cancelTitle || "Cancel"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                </>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}