import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, X, Search, UtensilsCrossed, ShieldAlert } from 'lucide-react';
import { INDIAN_SUBSTITUTIONS, getSubstitutionsForIngredient } from '../utils/substitutions';
import { PantryItem } from '../types';

interface SubstitutionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetIngredient?: string | null;
  pantryItems: PantryItem[];
  masalaDabbaActive: boolean;
  onApplySubstitution?: (original: string, substitute: string) => void;
}

export const SubstitutionsModal: React.FC<SubstitutionsModalProps> = ({
  isOpen,
  onClose,
  targetIngredient,
  pantryItems,
  masalaDabbaActive,
  onApplySubstitution
}) => {
  const [searchTerm, setSearchTerm] = useState(targetIngredient || '');
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  if (!isOpen) return null;

  const pantryNames = pantryItems.map((i) => i.name);

  // If a specific ingredient was passed in, query for that, else allow user to search all Indian staples
  const filteredSubstitutions = INDIAN_SUBSTITUTIONS.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.targetIngredient.toLowerCase().includes(term) ||
      item.primaryFlavorProfile.toLowerCase().includes(term) ||
      item.alternatives.some((a) => a.name.toLowerCase().includes(term) || (a.hindiName && a.hindiName.includes(term)))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 to-[#046A38] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl border border-white/20">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">Desi Substitutions Engine</h3>
                <span className="text-[10px] bg-yellow-400 text-emerald-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Flavor-Aligned
                </span>
              </div>
              <p className="text-xs text-emerald-100 opacity-90 mt-0.5">
                Authentic Indian culinary swaps that preserve your dish&apos;s taste & aroma
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-emerald-50/60 border-b border-emerald-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search missing ingredient (e.g., coriander, tomato, paneer, dahi, besan)..."
              className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-emerald-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
            Matches live against items in your Smart Pantry and active Masala Dabba spices.
          </p>
        </div>

        {/* Substitutions List */}
        <div className="p-5 overflow-y-auto space-y-5 divide-y divide-slate-100 flex-1">
          {filteredSubstitutions.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <UtensilsCrossed className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-600 text-sm">No exact Indian culinary substitution found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Try searching for universal staples like &ldquo;tomato&rdquo;, &ldquo;coriander&rdquo;, &ldquo;paneer&rdquo;, or &ldquo;dahi&rdquo;.
              </p>
            </div>
          ) : (
            filteredSubstitutions.map((entry, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-5' : ''}>
                {/* Target Ingredient & Flavor Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      Missing: {entry.targetIngredient}
                    </h4>
                    <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                      🎯 Flavor Target: {entry.primaryFlavorProfile}
                    </span>
                  </div>
                </div>

                {/* Alternatives Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {entry.alternatives.map((alt, aIdx) => {
                    // Check live pantry availability
                    const isAvailable =
                      (alt.isMasalaDabba && masalaDabbaActive) ||
                      pantryNames.some((pName) =>
                        alt.name.toLowerCase().includes(pName.toLowerCase()) ||
                        pName.toLowerCase().includes(alt.name.split(' ')[0].toLowerCase())
                      );

                    return (
                      <div
                        key={aIdx}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isAvailable
                            ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                                {alt.name}
                              </h5>
                              {alt.hindiName && (
                                <span className="text-[11px] text-slate-500 font-hindi">
                                  ({alt.hindiName})
                                </span>
                              )}
                            </div>
                            {isAvailable ? (
                              <span className="text-[10px] font-bold text-emerald-800 bg-white border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                In Your Kitchen
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                                Pantry Alt
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-xs">
                            <span className="font-bold text-emerald-900 bg-emerald-100/60 px-1.5 py-0.5 rounded text-[10px]">
                              Ratio: {alt.ratio}
                            </span>
                            <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                              {alt.flavorNote}
                            </p>
                          </div>
                        </div>

                        {onApplySubstitution && (
                          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                onApplySubstitution(entry.targetIngredient, alt.name);
                                onClose();
                              }}
                              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-100/50 px-2.5 py-1 rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                            >
                              Use in Recipe &rarr;
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            💡 Tip: Masala Dabba spices never require a grocery run.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
