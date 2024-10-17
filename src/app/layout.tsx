import "./globals.css";
import { AlertProvider } from './contexts/AlertContext';
import ClientLayout from './ClientLayout';
import { AuthProvider } from "./contexts/AuthContext";
import { Poppins } from 'next/font/google';
import GoogleAnalytics from './Components/MainComponents/GoogleAnalytics'; // Asegúrate de crear este componente

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
      <head>
        <GoogleAnalytics measurementId="G-P0RDRGZ5CQ" />
      </head>
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