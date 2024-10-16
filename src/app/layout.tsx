import "./globals.css";
import { AlertProvider } from './contexts/AlertContext';
import ClientLayout from './ClientLayout';
import { AuthProvider } from "./contexts/AuthContext";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} font-sans`}>
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