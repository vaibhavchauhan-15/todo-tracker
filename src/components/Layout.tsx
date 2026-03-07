import React from 'react';
import { motion } from 'framer-motion';
import { useSidebar } from './sidebar/SidebarContext';
import Sidebar from './sidebar/Sidebar';

interface LayoutProps {
  user: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  };
  children: React.ReactNode;
  onCreateTask?: () => void;
  onLogout?: () => void;
  onNavChange?: (key: string) => void;
}

const SIDEBAR_EXPANDED  = 260;
const SIDEBAR_COLLAPSED = 70;

const Layout: React.FC<LayoutProps> = ({ user, children, onCreateTask, onLogout, onNavChange }) => {
  const { expanded } = useSidebar();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--c-bg)' }}>
      <Sidebar
        user={user}
        onCreateTask={onCreateTask}
        onLogout={onLogout}
        onNavChange={onNavChange}
      />

      {/* Main content — shifts with sidebar */}
      <motion.main
        animate={{ marginLeft: expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED }}
        transition={{ type: 'spring', stiffness: 320, damping: 38 }}
        style={{
          flex: 1,
          minHeight: '100vh',
          overflowX: 'hidden',
          background: 'var(--c-bg)',
        }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
