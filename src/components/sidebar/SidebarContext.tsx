import React, { createContext, useContext, useState } from 'react';

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
  const [expanded, setExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState('daily');

  return (
    <SidebarContext.Provider value={{ expanded, toggle: () => setExpanded(p => !p), activeNav, setActiveNav }}>
      {children}
    </SidebarContext.Provider>
  );
};
