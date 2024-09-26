// components/layout.tsx
import "./globals.css";
import { AlertProvider } from './contexts/AlertContext';
import ClientLayout from './ClientLayout';
import { AuthProvider } from "./contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AlertProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
