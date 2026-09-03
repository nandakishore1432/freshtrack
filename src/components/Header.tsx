import React from 'react';
import { Leaf, Sparkles, Flame } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  annualSavings?: number;
  expiringCount: number;
  expiringItemNames?: string[];
  masalaDabbaActive: boolean;
  onToggleMasalaDabba: () => void;
  onOpenProfile: () => void;
  onOpenMasalaDabbaModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  annualSavings,
  expiringCount,
  expiringItemNames = [],
  masalaDabbaActive,
  onToggleMasalaDabba,
  onOpenProfile,
  onOpenMasalaDabbaModal
}) => {
  return (
    <header id="freshtrack-header" className="sticky top-0 z-40 bg-[#046A38] text-white px-4 sm:px-8 py-3.5 shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#046A38] flex items-center justify-center shadow-sm font-bold">
              <Leaf className="w-5 h-5 text-[#046A38]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  FreshTrack AI
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Desi Edition
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-medium opacity-85 uppercase tracking-widest text-emerald-100">
                Smart Pantry & Zero-Waste Meals
              </p>
            </div>
          </div>

          {/* Right Section: Masala Dabba Pill & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Masala Dabba Quick Toggle Button */}
            <button
              id="masala-dabba-toggle-btn"
              type="button"
              onClick={onOpenMasalaDabbaModal}
              title="Click to view your Indian Masala Dabba spices"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${
                masalaDabbaActive
                  ? 'bg-yellow-400/90 text-emerald-950 border-yellow-300 hover:bg-yellow-300 shadow-xs'
                  : 'bg-emerald-900/60 text-emerald-200 border-emerald-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              <span>Masala Dabba</span>
              <span className="text-[10px] bg-white/50 text-emerald-950 px-1.5 py-0.2 rounded-full font-black">7 Spices</span>
            </button>

            {/* Profile Avatar Badge */}
            <button
              id="user-profile-header-btn"
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-0.5 sm:p-1 rounded-full hover:opacity-90 transition-all text-left"
              title="Manage Household Profile"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full border-2 border-emerald-300 flex items-center justify-center text-emerald-900 font-black text-sm shadow-sm">
                {userProfile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="hidden xl:block text-xs text-white">
                <p className="font-bold leading-tight truncate max-w-[100px]">{userProfile.name}</p>
                <p className="text-[10px] opacity-75 truncate max-w-[100px]">{userProfile.household}</p>
              </div>
            </button>

          </div>

        </div>

        {/* High Urgency Notification Ribbon if expiring items exist */}
        {expiringCount > 0 && (
          <div id="urgent-alert-banner" className="mt-3 px-3.5 py-2 rounded-xl bg-red-500/90 text-white border border-red-400 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-1 shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <Flame className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>
                <strong>{expiringCount} item{expiringCount > 1 ? 's' : ''}</strong> expiring in &le; 48 hours{expiringItemNames.length > 0 ? ` (${expiringItemNames.slice(0, 3).join(', ')}${expiringItemNames.length > 3 ? '...' : ''})` : ''}. Cook a zero-waste recipe today!
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white text-red-600 px-2 py-0.5 rounded-md shrink-0 ml-2 shadow-xs">
              Act Now
            </span>
          </div>
        )}

      </div>
    </header>
  );
};
