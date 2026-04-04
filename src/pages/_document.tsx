// pages/_document.tsx
'use client'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html className="theme-initialized">
        <Head />
        <body className="bg-gray-50 dark:bg-[#14121e] min-h-screen max-w-lg mx-auto transition-colors duration-300">
          {/* Скрипт для применения темы ДО гидратации */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    console.log('theme init')
                    var theme = localStorage.getItem('theme');
                    if (!theme) theme = 'light';
                    console.log('>>>', theme)
                    document.documentElement.className = theme === '"dark"' ? 'dark' : 'light';
                  } catch(e) {}
                })();
              `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument