'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Users, 
  Settings, 
  MessageSquare,
  Building2
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Invoice', href: '/invoices', icon: FileText },
  { name: 'Other files', href: '/files', icon: FolderOpen },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const styles = {
  sidebar: {
    position: 'fixed' as const,
    left: 0,
    top: 0,
    height: '100vh',
    width: '256px',
    backgroundColor: '#1e293b', // Dark grey/slate
    borderRight: '1px solid #334155',
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: 40,
  },
  logo: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    borderBottom: '1px solid #334155',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#f1f5f9', // Light text for dark background
  },
  nav: {
    flex: 1,
    padding: '24px 16px',
    overflowY: 'auto' as const,
  },
  navLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    padding: '0 12px',
    marginBottom: '12px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.2s',
    marginBottom: '4px',
    cursor: 'pointer',
  },
  navItemActive: {
    backgroundColor: '#334155',
    color: '#ffffff',
    fontWeight: 500,
  },
  navItemInactive: {
    color: '#cbd5e1',
  },
  chatButton: {
    margin: '0 16px 24px',
    padding: '10px 12px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
    color: '#ffffff',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  branding: {
    padding: '16px 24px',
    borderTop: '1px solid #334155',
    display: 'flex',
    alignItems: 'center',
  },
  brandingIcon: {
    width: '24px',
    height: '24px',
    background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
  },
  brandingText: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#cbd5e1',
  },
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px' }}>F</span>
        </div>
        <span style={styles.logoText}>Flowbit AI Dashboard</span>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navLabel}>GENERAL</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : styles.navItemInactive),
              }}
            >
              <Icon style={{ width: '20px', height: '20px', marginRight: '12px' }} />
              <span style={{ fontSize: '14px' }}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Chat with Data Link */}
      <Link href="/chat-with-data" style={styles.chatButton}>
        <MessageSquare style={{ width: '20px', height: '20px', marginRight: '12px' }} />
        <span style={{ fontSize: '14px', fontWeight: 500 }}>Chat with Data</span>
      </Link>

      {/* Flowbit AI Branding */}
      <div style={styles.branding}>
        <div style={styles.brandingIcon}>
          <span style={{ color: '#ffffff', fontSize: '12px' }}>⚡</span>
        </div>
        <span style={styles.brandingText}>Flowbit AI</span>
      </div>
    </aside>
  );
}
