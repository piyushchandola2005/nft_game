import React from 'react';
import { Sparkles, Swords, ShoppingCart, Package, Clock } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate }) => {
  const navItems = [
    { id: 'mint', label: 'Mint', icon: Sparkles },
    { id: 'battle', label: 'Battle', icon: Swords },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'history', label: 'History', icon: Clock },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-md border-t border-gray-800 md:top-20 md:bottom-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex md:justify-center overflow-x-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeSection === id
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
