import React from 'react';
import { useSidebar } from './sidebar/SidebarContext';
import Sidebar from './sidebar/Sidebar';
import MobileBottomNav from './MobileBottomNav';
import { useIsMobile } from './workspace/useIsMobile';

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
  streak?: number;
}

const SIDEBAR_EXPANDED  = 260;
const SIDEBAR_COLLAPSED = 70;

const Layout: React.FC<LayoutProps> = ({ user, children, onCreateTask, onLogout, onNavChange, streak }) => {
  const { expanded } = useSidebar();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--c-bg)' }}>
        <main
          style={{
            flex: 1,
            minHeight: '100vh',
            overflowX: 'hidden',
            background: 'var(--c-bg)',
            paddingBottom: 80,
          }}
        >
          {children}
        </main>
        <MobileBottomNav
          user={user}
          streak={streak ?? 0}
          onCreateTask={onCreateTask}
          onLogout={onLogout}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--c-bg)' }}>
      <Sidebar
        user={user}
        onCreateTask={onCreateTask}
        onLogout={onLogout}
        onNavChange={onNavChange}
        streak={streak ?? 0}
      />

      {/* Main content — shifts with sidebar via CSS transition */}
      <main
        style={{
          flex: 1,
          minHeight: '100vh',
          overflowX: 'hidden',
          background: 'var(--c-bg)',
          marginLeft: expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED,
          transition: 'margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
