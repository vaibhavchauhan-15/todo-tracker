import React, { createContext, useContext, useState, useCallback } from 'react';

interface SidebarContextType {
  expanded: boolean;
  toggle: () => void;
  activeNav: string;
  setActiveNav: (key: string) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  toggle: () => {},
  activeNav: 'daily',
  setActiveNav: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expanded, setExpanded] = useState(() => {
    try { return localStorage.getItem('sidebar-expanded') !== 'false'; } catch { return true; }
  });
  const [activeNav, setActiveNav] = useState('daily');

  const toggle = useCallback(() => {
    setExpanded(prev => {
      const next = !prev;
      try { localStorage.setItem('sidebar-expanded', String(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider value={{ expanded, toggle, activeNav, setActiveNav }}>
      {children}
    </SidebarContext.Provider>
  );
};
