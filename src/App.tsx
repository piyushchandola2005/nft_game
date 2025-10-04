import React, { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import { Hero } from './components/Hero';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LoginModal } from './components/LoginModal';
import { MintSection } from './components/MintSection';
import { BattleArena } from './components/BattleArena';
import { Marketplace } from './components/Marketplace';
import { Inventory } from './components/Inventory';
import { BattleHistory } from './components/BattleHistory';
import { useGame } from './contexts/GameContext';

function AppContent() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeSection, setActiveSection] = useState('mint');
  const { login } = useGame();

  const handleLogin = (username: string, walletAddress: string) => {
    login(username, walletAddress);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onLoginClick={() => setShowLoginModal(true)} />

      <Hero />

      <div id="game-section" className="pt-20 md:pt-0">
        <Navigation activeSection={activeSection} onNavigate={setActiveSection} />

        <div className="pb-20 md:pb-0">
          {activeSection === 'mint' && <MintSection />}
          {activeSection === 'battle' && <BattleArena />}
          {activeSection === 'marketplace' && <Marketplace />}
          {activeSection === 'inventory' && <Inventory />}
          {activeSection === 'history' && <BattleHistory />}
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
