'use client';

import { Search, Bell, ChevronDown, Building2 } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const styles = {
  header: {
    height: '64px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#0f172a',
    margin: 0,
  },
  departmentSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  departmentIcon: {
    width: '20px',
    height: '20px',
    color: '#3b82f6',
  },
  departmentInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  departmentName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#0f172a',
    margin: 0,
  },
  departmentMembers: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  searchContainer: {
    position: 'relative' as const,
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '16px',
    height: '16px',
    color: '#94a3b8',
  },
  searchInput: {
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    width: '256px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  iconButton: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    border: 'none',
    backgroundColor: 'transparent',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '14px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  userName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#0f172a',
    margin: 0,
  },
  userRole: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
};

export default function Header({ title = 'Dashboard' }: HeaderProps) {
  return (
    <header style={styles.header}>
      {/* Left Section */}
      <div style={styles.leftSection}>
        {/* Title Section */}
        <div style={styles.titleSection}>
          <h1 style={styles.title}>{title}</h1>
        </div>
        
        {/* Buchhaltung Department Section */}
        <div style={styles.departmentSection}>
          <Building2 style={styles.departmentIcon} />
          <div style={styles.departmentInfo}>
            <p style={styles.departmentName}>Buchhaltung</p>
            <p style={styles.departmentMembers}>12 members</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>
        {/* Search */}
        <div style={styles.searchContainer}>
          <Search style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Dashboard"
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Notification Bell */}
        <button
          style={styles.iconButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Bell style={{ width: '20px', height: '20px', color: '#64748b' }} />
        </button>

        {/* User Profile */}
        <div
          style={styles.userSection}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div style={styles.avatar}>AJ</div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>Amit Jadhav</p>
            <p style={styles.userRole}>Admin</p>
          </div>
          <ChevronDown style={{ width: '16px', height: '16px', color: '#64748b' }} />
        </div>
      </div>
    </header>
  );
}
