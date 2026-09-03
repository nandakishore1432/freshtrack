import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, Check, X, ShieldCheck, Sparkles, Snowflake, Box, Thermometer } from 'lucide-react';
import { PantryItem, StorageLocation } from '../types';
import { predictShelfLife, calculateExpiryDateString, calculateDaysLeftFromDateString } from '../utils/expiryPredictor';

interface OverrideExpiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PantryItem | null;
  onSave: (updatedItem: PantryItem) => void;
}

export const OverrideExpiryModal: React.FC<OverrideExpiryModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave
}) => {
  const [selectedStorage, setSelectedStorage] = useState<StorageLocation>('fridge');
  const [customDaysLeft, setCustomDaysLeft] = useState<number>(3);
  const [customDate, setCustomDate] = useState<string>('');

  useEffect(() => {
    if (item) {
      setSelectedStorage(item.storageType || 'fridge');
      setCustomDaysLeft(item.daysLeft);
      const initialDate = item.expiryDate || calculateExpiryDateString(item.daysLeft);
      setCustomDate(initialDate);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const prediction = predictShelfLife(item.name, item.category, selectedStorage);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomDate(val);
    const calculatedDays = calculateDaysLeftFromDateString(val);
    setCustomDaysLeft(calculatedDays);
  };

  const handleDaysPreset = (days: number) => {
    setCustomDaysLeft(days);
    setCustomDate(calculateExpiryDateString(days));
  };

  const handleStorageChange = (storage: StorageLocation) => {
    setSelectedStorage(storage);
    const newPred = predictShelfLife(item.name, item.category, storage);
    setCustomDaysLeft(newPred.defaultDays);
    setCustomDate(calculateExpiryDateString(newPred.defaultDays));
  };

  const handleSave = () => {
    const updated: PantryItem = {
      ...item,
      daysLeft: customDaysLeft,
      expiryDate: customDate,
      storageType: selectedStorage,
      isCustomExpiry: true,
      notes: item.notes ? `${item.notes} • Expiry set to ${customDate}` : `Manual expiry: ${customDate}`
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-100 overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 to-[#046A38] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl border border-white/20">
              ⏱️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">Adjust Expiry & Shelf Life</h3>
                <span className="text-[10px] bg-yellow-400 text-emerald-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Manual Override
                </span>
              </div>
              <p className="text-xs text-emerald-100 opacity-90 truncate max-w-xs sm:max-w-sm">
                {item.name} ({item.quantity})
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

        {/* Body Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* AI Prediction Insight Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold flex items-center gap-1.5 text-emerald-900 uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Desi Shelf-Life Prediction
              </span>
              <span className="bg-white text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 text-[10px]">
                Category: {item.category}
              </span>
            </div>
            <p className="text-emerald-800 leading-relaxed font-medium">
              {prediction.reason}
            </p>
            <div className="pt-2 border-t border-emerald-200/70 text-[11px] text-emerald-900 font-semibold flex items-start gap-1.5">
              <span>💡 Hack:</span>
              <span className="text-slate-700 font-normal">{prediction.storageTips.preservationHack}</span>
            </div>
          </div>

          {/* Storage Condition Picker */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Storage Environment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fridge', label: 'Refrigerator', icon: Thermometer, note: `${prediction.storageTips.refrigeratedDays}d default` },
                { id: 'pantry', label: 'Cool Dabba', icon: Box, note: `${prediction.storageTips.roomTempDays}d default` },
                { id: 'freezer', label: 'Deep Freezer', icon: Snowflake, note: `${prediction.storageTips.frozenDays || 60}d default` }
              ].map((loc) => {
                const Icon = loc.icon;
                const active = selectedStorage === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleStorageChange(loc.id as StorageLocation)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      active
                        ? 'bg-[#046A38] text-white border-[#046A38] shadow-sm font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold leading-tight">{loc.label}</span>
                    <span className={`text-[10px] ${active ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {loc.note}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Preset Days Pills */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Quick Days Remaining Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 5, 7, 14, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => handleDaysPreset(days)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    customDaysLeft === days
                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {days === 1 ? '1 Day (Critical)' : days === 2 ? '2 Days' : `${days} Days`}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Picker & Days Counter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Calendar Expiry Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={customDate}
                  onChange={handleDateChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Days Remaining
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  max="730"
                  value={customDaysLeft}
                  onChange={(e) => {
                    const d = parseInt(e.target.value) || 0;
                    setCustomDaysLeft(d);
                    setCustomDate(calculateExpiryDateString(d));
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Countdown Preview */}
          <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">New Status Tier:</span>
            <span
              className={`font-black px-2.5 py-1 rounded-full text-xs ${
                customDaysLeft <= 2
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : customDaysLeft <= 4
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {customDaysLeft <= 2 ? '🔥 High Urgency (<= 48h)' : customDaysLeft <= 4 ? '⚡ Consume Soon (2-4d)' : '✓ Safe Pantry (5d+)'}
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Expiry Override</span>
          </button>
        </div>

      </div>
    </div>
  );
};
