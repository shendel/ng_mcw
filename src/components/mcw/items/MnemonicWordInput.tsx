import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as bip39 from 'bip39';

const MnemonicWordInput = ({ 
  index, 
  value, 
  onChange, 
  onBlur,
  onPaste,
  isInvalid: externalInvalid,
  isFirst = false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredWords, setFilteredWords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const wordlist = useMemo(() => {
    return bip39.wordlists[bip39.getDefaultWordlist()] || bip39.wordlists.en;
  }, []);

  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const filtered = wordlist.filter(word => 
        word.toLowerCase().startsWith(inputValue.toLowerCase())
      ).slice(0, 10);
      
      setFilteredWords(filtered);
      setIsOpen(filtered.length > 0);
      setHighlightedIndex(-1);
    } else {
      setFilteredWords([]);
      setIsOpen(false);
    }

    if (inputValue.trim().length > 0) {
      const wordExists = wordlist.includes(inputValue.toLowerCase().trim());
      setIsValid(wordExists);
    } else {
      setIsValid(true);
    }
  }, [inputValue, wordlist]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value.toLowerCase();
    setInputValue(newValue);
    onChange(newValue);
  };

  const handlePaste = (e) => {
    if (isFirst) {
      const pasteData = e.clipboardData.getData('text');
      
      // Check if it looks like a seed phrase (contains spaces or newlines)
      if (pasteData.includes(' ') || pasteData.includes('\n') || pasteData.includes(',')) {
        e.preventDefault();
        
        // Split by spaces, newlines, or commas, filter empty strings
        const words = pasteData.toLowerCase().split(/[\s\n,]+/).filter(w => w.trim() !== '');
        
        if (words.length > 0) {
          onPaste(words);
        }
      }
    }
  };

  const handleSelectWord = (word) => {
    setInputValue(word);
    onChange(word);
    setIsOpen(false);
    setHighlightedIndex(-1);
    
    if (inputRef.current) {
      const nextInput = inputRef.current.parentElement?.parentElement?.nextElementSibling?.querySelector('input');
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredWords.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredWords[highlightedIndex]) {
          handleSelectWord(filteredWords[highlightedIndex]);
        } else if (filteredWords.length > 0) {
          handleSelectWord(filteredWords[0]);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      
      case 'Tab':
        setIsOpen(false);
        break;
      
      default:
        break;
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
      onBlur?.();
    }, 200);
  };

  const isInvalid = externalInvalid || (!isValid && inputValue.trim().length > 0);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className={`
        bg-white dark:bg-[#1c1830] border rounded-lg px-2 py-2 flex items-center gap-1
        transition-all duration-200
        ${isInvalid 
          ? 'border-red-500 dark:border-red-500 ring-2 ring-red-500/20' 
          : 'border-gray-200 dark:border-white/10 focus-within:border-wallet-purple focus-within:ring-1 focus-within:ring-wallet-purple'
        }
      `}>
        <span className="text-gray-400 text-xs font-medium w-6 text-center">
          {index}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`
            flex-1 bg-transparent text-gray-900 dark:text-gray-100 
            placeholder-gray-400 dark:placeholder-gray-500 
            focus:outline-none text-sm font-mono lowercase
            ${isInvalid ? 'text-red-600 dark:text-red-400' : ''}
          `}
          placeholder={isFirst ? "word1 word2..." : "word"}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {/*
        {isInvalid && (
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {!isInvalid && inputValue && (
          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
        */}
      </div>

      {isOpen && filteredWords.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1c1830] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl max-h-60 overflow-auto">
          {filteredWords.map((word, idx) => (
            <button
              key={word}
              onClick={() => handleSelectWord(word)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={`
                w-full px-3 py-2 text-left text-sm font-mono lowercase
                transition-colors duration-150
                ${idx === highlightedIndex 
                  ? 'bg-wallet-purple text-white' 
                  : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="flex items-center justify-between">
                <span>{word}</span>
                {idx === 0 && (
                  <span className="text-xs opacity-60">Enter</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MnemonicWordInput