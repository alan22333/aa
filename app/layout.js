import { Press_Start_2P, VT323 } from 'next/font/google';
import './globals.css';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const pixelBodyFont = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel-body',
  display: 'swap',
});

export const metadata = {
  title: 'Travel Expense Splitter',
  description: 'A cyberpunk-style app for managing and splitting travel expenses',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${pixelBodyFont.variable}`}>
      <body>
        <div className="cyber-grid min-h-screen">
          <div className="fixed top-0 right-4 p-2 text-green-400 font-pixel text-sm">
            {new Date().toLocaleTimeString()}
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
