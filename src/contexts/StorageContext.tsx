'use client'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';

export type StorageValue = string | number | boolean | object | null | undefined;
export type StorageMap = Record<string, StorageValue>;

export interface StorageContextType {
  values: StorageMap;
  getValue: (key: string) => any;
  setValue: (key: string, value: StorageValue) => void;
  removeValue: (key: string) => void;
  refresh: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

// Безопасный парсер (примитивы, массивы, объекты, null/undefined)
const parseStorageValue = (raw: string | null): StorageValue => {
  if (raw === null || raw === undefined) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw; // fallback для обычных строк
  }
};

interface StorageProviderProps {
  /** Ключи, которые нужно отслеживать */
  keys: string[];
  /** Дефолтные значения, если ключа нет в localStorage */
  defaults?: Record<string, StorageValue>;
  children: React.ReactNode;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({ keys, defaults = {}, children }) => {
  const [values, setValues] = useState<StorageMap>({});
  const isMounted = useRef(false);
  const lastUpdatedKey = useRef<string | null>(null);

  // Хелпер: LS → дефолт → null
  const resolveValue = useCallback(
    (key: string, raw: string | null): StorageValue => {
      if (raw !== null) return parseStorageValue(raw);
      return key in defaults ? defaults[key] : null;
    },
    [defaults]
  );

  const getValue = (key) => {
    return resolveValue(key, localStorage.getItem(key))
  }
  // 1. Инициализация при маунте
  useEffect(() => {
    const initial: StorageMap = {};
    keys.forEach(key => {
      initial[key] = resolveValue(key, localStorage.getItem(key));
    });
    setValues(initial);
    isMounted.current = true;
  }, [keys, resolveValue]);

  // 2. Кросстабная синхронизация
  useEffect(() => {
    const handleCrossTabChange = (e: StorageEvent) => {
      if (!e.key || !keys.includes(e.key) || e.key === lastUpdatedKey.current) return;
      lastUpdatedKey.current = null;

      const newVal = resolveValue(e.key, e.newValue);
      setValues(prev => ({ ...prev, [e.key]: newVal }));
    };

    window.addEventListener('storage', handleCrossTabChange);
    return () => window.removeEventListener('storage', handleCrossTabChange);
  }, [keys, resolveValue]);

  // 3. Синхронизация в текущей вкладке (если кто-то пишет в LS напрямую)
  useEffect(() => {
    const handleSameTabSync = (e: Event) => {
      const { key, value } = (e as CustomEvent).detail;
      if (!keys.includes(key) || key === lastUpdatedKey.current) return;

      const resolved = value !== null && value !== undefined ? value : resolveValue(key, null);
      setValues(prev => ({ ...prev, [key]: resolved }));
    };

    window.addEventListener('app-storage-sync', handleSameTabSync);
    return () => window.removeEventListener('app-storage-sync', handleSameTabSync);
  }, [keys, resolveValue]);

  const setValue = useCallback((key: string, value: StorageValue) => {
    if (!isMounted.current || !keys.includes(key)) return;
    lastUpdatedKey.current = key;

    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }

    setValues(prev => ({ ...prev, [key]: value }));
    window.dispatchEvent(new CustomEvent('app-storage-sync', { detail: { key, value } }));
  }, [keys]);

  const removeValue = useCallback((key: string) => {
    if (!isMounted.current || !keys.includes(key)) return;
    lastUpdatedKey.current = key;

    localStorage.removeItem(key);
    
    // При удалении возвращаем дефолт, если он есть
    const fallback = key in defaults ? defaults[key] : null;
    setValues(prev => ({ ...prev, [key]: fallback }));

    window.dispatchEvent(new CustomEvent('app-storage-sync', { detail: { key, value: null } }));
  }, [keys, defaults]);

  const refresh = useCallback(() => {
    if (!isMounted.current) return;
    const updated: StorageMap = {};
    keys.forEach(key => {
      updated[key] = resolveValue(key, localStorage.getItem(key));
    });
    setValues(updated);
  }, [keys, resolveValue]);

  const contextValue = useMemo(
    () => ({ values, setValue, getValue, removeValue, refresh }),
    [values, setValue, getValue, removeValue, refresh]
  );

  return (
    <StorageContext.Provider value={contextValue}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) throw new Error('useStorage must be used within a <StorageProvider>');
  return context;
};