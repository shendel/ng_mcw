import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as bip39 from 'bip39';
import MnemonicWordInput  from './MnemonicWordInput'

const MnemonicInputGrid = ({ wordCount = 12, seedWords, onSeedChange }) => {
  const [errors, setErrors] = useState({});
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const handleChange = (index, value) => {
    const newWords = [...seedWords];
    newWords[index] = value;
    onSeedChange(newWords);
    
    if (errors[index]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const handleBulkPaste = (words) => {
    // Limit to wordCount
    const limitedWords = words.slice(0, wordCount);
    
    // Fill remaining with empty strings
    const newWords = Array(wordCount).fill('');
    limitedWords.forEach((word, i) => {
      if (i < wordCount) {
        newWords[i] = word;
      }
    });

    onSeedChange(newWords);
    setErrors({});
    
    // Show success feedback
    setPasteSuccess(true);
    setTimeout(() => setPasteSuccess(false), 2000);

    // Focus on first invalid word if any
    const wordlist = bip39.wordlists[bip39.getDefaultWordlist()] || bip39.wordlists.en;
    const firstInvalidIndex = newWords.findIndex((w, i) => i < limitedWords.length && !wordlist.includes(w));
    
    if (firstInvalidIndex >= 0) {
      const input = document.querySelector(`input[aria-index="${firstInvalidIndex + 1}"]`);
      if (input) input.focus();
    }
  };

  const validateAll = () => {
    const wordlist = bip39.wordlists[bip39.getDefaultWordlist()] || bip39.wordlists.en;
    const newErrors = {};
    
    seedWords.forEach((word, index) => {
      if (word.trim() && !wordlist.includes(word.toLowerCase().trim())) {
        newErrors[index] = true;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    window.validateMnemonic = validateAll;
    return () => {
      delete window.validateMnemonic;
    };
  }, [seedWords]);

  const columns = 3;

  return (
    <div className="relative">
      {/* Paste Success Toast */}
      {pasteSuccess && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 animate-fade-in-down">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Фраза вставлена!</span>
          </div>
        </div>
      )}

      {/* Input Grid */}
      <div className={`grid grid-cols-${columns} gap-2 mb-6`}>
        {Array.from({ length: wordCount }, (_, i) => (
          <MnemonicWordInput
            key={i}
            index={i + 1}
            value={seedWords[i] || ''}
            onChange={(value) => handleChange(i, value)}
            onBlur={validateAll}
            onPaste={handleBulkPaste}
            isInvalid={errors[i]}
            isFirst={i === 0}
          />
        ))}
      </div>
    </div>
  );
};


export default MnemonicInputGrid