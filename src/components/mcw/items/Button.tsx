import React from 'react';

/**
 * Button Component
 * 
 * @param {Object} props
 * @param {'brand' | 'second' | 'outline'} props.variant - Стиль кнопки (по умолчанию 'brand')
 * @param {'sm' | 'md' | 'lg'} props.size - Размер кнопки (по умолчанию 'md')
 * @param {boolean} props.disabled - Состояние disabled
 * @param {false | 'start' | 'middle' | 'end'} props.isGroup - Позиция в группе кнопок
 * @param {Function} props.onClick - Обработчик клика
 * @param {React.ReactNode} props.children - Содержимое кнопки (текст, иконки)
 * @param {string} props.className - Дополнительные классы
 */
const Button = (props) => {
  const {
    variant = 'brand',
    size = 'md',
    disabled = false,
    isGroup = false,
    fullWidth = false,
    onClick,
    children,
    className = '',
    ...restProps
  } = props
  
  // --- Base Classes ---
  const baseClasses = `${(fullWidth) ? 'w-full' : ''} inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#14121e]`;

  // --- Size Classes ---
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded gap-1.5",
    md: "px-6 py-3 text-base rounded gap-2",
    lg: "px-8 py-4 text-lg rounded gap-3",
  };

  // --- Variant Classes (Normal State) ---
  const variantClasses = {
    brand: "bg-wallet-purple hover:bg-wallet-purple-hover text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-0.5",
    second: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100",
    outline: "bg-transparent border-2 border-wallet-purple text-wallet-purple hover:bg-wallet-purple hover:text-white",
  };

  // --- Disabled Classes ---
  const disabledClasses = {
    brand: "bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-600 shadow-none cursor-not-allowed hover:translate-y-0 hover:shadow-none",
    second: "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed",
    outline: "border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed hover:bg-transparent hover:text-gray-400",
  };

  // --- Group Classes (Border Radius Handling) ---
  // If it's part of a group, we remove standard rounding and apply specific sides
  const groupClasses = {
    false: "", // Standard rounding from sizeClasses applies
    start: "rounded-r-none border-r-0",
    middle: "rounded-none border-r-0 border-l-0",
    end: "rounded-l-none border-l-0",
  };

  // --- Focus Ring Offset Color ---
  // Adjusts based on variant to ensure visibility
  const focusRingColor = variant === 'brand' ? 'focus:ring-purple-500' : 'focus:ring-gray-500';

  // --- Construct Final Class String ---
  const finalClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${disabled ? disabledClasses[variant] : variantClasses[variant]}
    ${isGroup !== false ? groupClasses[isGroup] : ''}
    ${!disabled ? focusRingColor : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={finalClasses}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button