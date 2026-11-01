import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BillsProvider, useBills } from './context/BillsContext';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { FirebaseStatusBanner } from './components/common/FirebaseStatusBanner';
import { Toast } from './components/common/Toast';
import { SplashScreen } from './pages/SplashScreen';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { AddBillPage } from './pages/AddBillPage';
import { BillHistoryPage } from './pages/BillHistoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { currentUser, loading } = useAuth();
  const { toast } = useBills();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // 1. Splash Screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 2. Loading state while checking persistent session
  if (loading) {
    return <SplashScreen onFinish={() => {}} />;
  }

  // 3. Login & Sign Up Pages (Open Dashboard only after successful login)
  if (!currentUser) {
    return <AuthPage />;
  }

  // 4. Dashboard (authenticated owner)
  return (
    <div className="app-layout">
      {/* Desktop Fixed Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <FirebaseStatusBanner />
        <MobileNav activeTab={activeTab} onSelectTab={setActiveTab} />

        <main className="main-content-scroll">
          {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
          {activeTab === 'add-bill' && <AddBillPage onNavigate={setActiveTab} />}
          {activeTab === 'history' && <BillHistoryPage onNavigate={setActiveTab} />}
          {activeTab === 'reports' && <ReportsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Toast Notification */}
      <Toast toast={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BillsProvider>
        <AppContent />
      </BillsProvider>
    </AuthProvider>
  );
}
