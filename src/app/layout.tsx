// components/layout.tsx
import "./globals.css";
import { AlertProvider } from './contexts/AlertContext';
import ClientLayout from './ClientLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AlertProvider>
      </body>
    </html>
  );
}
