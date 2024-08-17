// components/layout.tsx
import "./globals.css";
import { AlertProvider } from './contexts/AlertContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>
          {children}
        </AlertProvider>
      </body>
    </html>
  );
}
