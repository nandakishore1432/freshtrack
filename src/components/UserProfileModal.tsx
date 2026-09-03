import React, { useState } from 'react';
import { X, User, Home, MapPin, Check, Sparkles, Shield, Bell } from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#046A38] flex items-center justify-center font-bold text-sm">
              {formData.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Household & Dietary Profile</h3>
              <p className="text-[11px] text-slate-500">Customizes recipe algorithms and shelf-life predictions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary Shopper Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#046A38]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Household Title</label>
            <input
              type="text"
              value={formData.household}
              onChange={(e) => setFormData({ ...formData, household: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#046A38]"
              placeholder="e.g. Sharma Family (4 Members)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Family Members</label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.memberCount}
                onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Dietary Preference</label>
            <select
              value={formData.dietaryPreference}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dietaryPreference: e.target.value as any,
                  isPureVeg: e.target.value === 'Vegetarian' || e.target.value === 'Jain (No Onion/Garlic)'
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
            >
              <option value="Vegetarian">Pure Vegetarian (Desi)</option>
              <option value="Jain (No Onion/Garlic)">Jain (No Onion / Garlic / Root Veg)</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan (No Dairy/Ghee)</option>
            </select>
          </div>

          {/* Quick Commerce Integrations status */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Connected Delivery Accounts:
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Blinkit Auto-Sync (+91 98***)</span>
              <span className="text-emerald-700 font-bold">Connected ✓</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Zepto Quick Ingest</span>
              <span className="text-emerald-700 font-bold">Connected ✓</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#046A38] hover:bg-[#03552d] text-white font-bold shadow-xs transition-colors"
            >
              {savedSuccess ? 'Saved ✓' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
