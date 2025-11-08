import './globals.css';
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export const metadata = { title: 'Flowbit AI Dashboard' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex' }}>
          <Sidebar />
          <div style={{ marginLeft: '256px', flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
            <Header />
            <main style={{ padding: '32px', flex: 1, backgroundColor: '#f8fafc', overflowX: 'auto' }}>
              <div style={{ maxWidth: '100%', width: '100%' }}>
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
