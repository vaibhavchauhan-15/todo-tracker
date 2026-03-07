import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Workspace from '../components/Workspace';
import Layout from '../components/Layout';
import { SidebarProvider, useSidebar } from '../components/sidebar/SidebarContext';
import { Category } from '../components/workspace/types';

interface UserData {
  uid: string; email: string | null; displayName: string | null; photoURL: string | null;
}
interface HomeProps { user: UserData }

/* ─── Inner content — needs sidebar context ── */
const HomeContent: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const { activeNav, setActiveNav } = useSidebar();
  const [triggerAdd, setTriggerAdd] = useState(false);
  const [streak, setStreak] = useState(0);

  const validCategories = ['daily', 'weekly', 'monthly', 'yearly'];
  const externalCategory = validCategories.includes(activeNav)
    ? (activeNav as Category)
    : undefined;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <Layout
      user={user}
      onCreateTask={() => setTriggerAdd(true)}
      onLogout={handleLogout}
      streak={streak}
    >
      <Workspace
        user={user}
        externalCategory={externalCategory}
        navView={activeNav}
        triggerAdd={triggerAdd}
        onAddHandled={() => setTriggerAdd(false)}
        onStreakChange={setStreak}
        onViewChange={setActiveNav}
      />
    </Layout>
  );
};

/* ─── Home ────────────────────────────────────────────────── */
const Home: React.FC<HomeProps> = ({ user }) => {
  return (
    <SidebarProvider>
      <HomeContent user={user} />
    </SidebarProvider>
  );
};

export default Home;

