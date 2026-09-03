import React from 'react';
import { X, Check, Sparkles, AlertCircle, Info } from 'lucide-react';
import { MASALA_DABBA_ITEMS } from '../data/mockData';

interface MasalaDabbaModalProps {
  isOpen: boolean;
  onClose: () => void;
  active: boolean;
  onToggleActive: (newVal: boolean) => void;
}

export const MasalaDabbaModal: React.FC<MasalaDabbaModalProps> = ({
  isOpen,
  onClose,
  active,
  onToggleActive
}) => {
  if (!isOpen) return null;

  return (
    <div id="masala-dabba-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div id="masala-dabba-modal" className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-900/50 border border-amber-400/40 flex items-center justify-center text-xl">
              🥘
            </div>
            <div>
              <h2 className="text-lg font-bold">Indian Masala Dabba (मसाला डिब्बा)</h2>
              <p className="text-xs text-amber-200">The 7 Essential Spices in Every Indian Kitchen</p>
            </div>
          </div>
          <button
            id="close-masala-dabba-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Master Toggle Banner */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-xl border border-amber-200">
            <div>
              <p className="text-sm font-bold text-amber-950">Auto-assume Masala Dabba Available</p>
              <p className="text-xs text-amber-800">
                FreshTrack recipes won't flag these 7 everyday staples as &quot;missing ingredients&quot;.
              </p>
            </div>
            <button
              id="masala-dabba-master-toggle"
              type="button"
              onClick={() => onToggleActive(!active)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                active ? 'bg-amber-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  active ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Visual 7-Katori Spice Box Layout */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                7 Traditional Spice Compartments (कटोरी)
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                All 7 In Stock
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MASALA_DABBA_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/70 transition-all"
                >
                  <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-bold shadow-inner shrink-0`}>
                    <Check className="w-4 h-4 text-white drop-shadow-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                      <span className="text-[10px] font-bold text-amber-800">{item.fillLevel}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{item.benefits}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              In Indian cooking, mustard oil, ghee, and these 7 spices are treated as kitchen baseline. With this toggle on, you get <strong>100% zero-cost rescue recipes</strong> without purchasing minor spices.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            id="close-masala-dabba-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#046A38] hover:bg-[#03552d] text-white font-semibold text-sm transition-colors shadow-xs"
          >
            Save & Continue
          </button>
        </div>

      </div>
    </div>
  );
};
