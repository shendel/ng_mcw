export const copyToClipboard = async (text) => {
  // 1. Попытка использовать современный API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Modern API failed, trying fallback', err);
    }
  }

  // 2. Fallback (запасной вариант) для старых браузеров или http
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Делаем элемент невидимым, но доступным для фокуса
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (err) {
    document.body.removeChild(textArea);
    console.error('Fallback execCommand failed', err);
    return false;
  }
};