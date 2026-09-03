import React, { useState } from 'react';
import {
  IndianRupee,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  Award,
  Calendar,
  Layers,
  Clock
} from 'lucide-react';
import { WasteSavingsStats } from '../types';

interface AnalyticsSavingsProps {
  stats: WasteSavingsStats;
}

export const AnalyticsSavings: React.FC<AnalyticsSavingsProps> = ({ stats }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'annual' | 'monthly'>('annual');

  return (
    <div id="rupee-savings-analytics" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner - Vibrant Palette */}
      <div className="bg-[#046A38] text-white p-6 rounded-2xl shadow-lg border border-emerald-800 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />

        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-yellow-300" /> Indian Household Impact Tracker
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            ₹{stats.annualRupeesSaved.toLocaleString('en-IN')} Saved Per Year
          </h2>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 leading-relaxed">
            Indian families discard up to ₹1,000/month in spoiled milk, rotting coriander, and curd. Here is your net zero-waste ledger.
          </p>
        </div>

        {/* Quick 3-Metric Summary Bar */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/20 text-center relative z-10">
          <div className="bg-black/20 p-2.5 rounded-xl border border-white/20 backdrop-blur-xs">
            <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">Food Saved</p>
            <p className="text-base sm:text-lg font-black text-white mt-0.5">{stats.kgFoodSavedThisMonth} kg</p>
            <p className="text-[10px] text-emerald-300">This Month</p>
          </div>
          <div className="bg-black/20 p-2.5 rounded-xl border border-white/20 backdrop-blur-xs">
            <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">Meals Rescued</p>
            <p className="text-base sm:text-lg font-black text-white mt-0.5">{stats.totalMealsRescued}</p>
            <p className="text-[10px] text-emerald-300">Zero-Waste Dishes</p>
          </div>
          <div className="bg-black/20 p-2.5 rounded-xl border border-white/20 backdrop-blur-xs">
            <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">CO2 Offset</p>
            <p className="text-base sm:text-lg font-black text-white mt-0.5">{stats.co2PreventedKg} kg</p>
            <p className="text-[10px] text-emerald-300">Methane Avoided</p>
          </div>
        </div>
      </div>

      {/* ANNUAL SAVINGS TRACKER: Visual Graph Contrasting Unmanaged vs FreshTrack */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <span>Annual Household Grocery Waste Comparison</span>
              {stats.annualRupeesSaved > 0 && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Savings Active
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Benchmark comparison against standard Indian urban household food waste (₹1,000/month baseline)
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedPeriod('annual')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedPeriod === 'annual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Annual View
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Monthly Average
            </button>
          </div>
        </div>

        {/* Visual Bar Comparison Graph */}
        <div className="space-y-4 pt-2">
          
          {/* Bar 1: Unmanaged Indian Household */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block"></span>
                Unmanaged Household Baseline (No Expiry Tracking)
              </span>
              <span className="text-rose-600 text-sm font-extrabold">
                ₹{selectedPeriod === 'annual' ? '12,000' : '1,000'}/{selectedPeriod === 'annual' ? 'yr' : 'mo'}
              </span>
            </div>
            <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden p-1">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg flex items-center justify-end px-3 text-white font-extrabold text-xs transition-all duration-700"
                style={{ width: '100%' }}
              >
                Estimated Waste Exposure
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Frequent milk souring, dried coriander, forgotten dahi, and spoiled vegetables.
            </p>
          </div>

          {/* Bar 2: FreshTrack AI Household */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="text-[#046A38] flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#046A38] inline-block"></span>
                Your Logged Household Savings
              </span>
              <span className="text-[#046A38] text-sm font-extrabold">
                ₹{selectedPeriod === 'annual' ? stats.annualRupeesSaved.toLocaleString('en-IN') : Math.round(stats.annualRupeesSaved / 12).toLocaleString('en-IN')}/{selectedPeriod === 'annual' ? 'yr' : 'mo'}
              </span>
            </div>
            <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden p-1">
              <div
                className="h-full bg-gradient-to-r from-[#046A38] to-emerald-500 rounded-lg flex items-center justify-end px-3 text-white font-extrabold text-xs transition-all duration-700"
                style={{ width: `${stats.annualRupeesSaved > 0 ? Math.min(100, Math.max(12, Math.round((stats.annualRupeesSaved / 12000) * 100))) : 0}%` }}
              >
                {stats.annualRupeesSaved > 0 ? `${Math.round((stats.annualRupeesSaved / 12000) * 100)}% Recouped` : '₹0 Logged Yet'}
              </div>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              {stats.annualRupeesSaved > 0
                ? 'Active shelf-life countdowns & zero-waste recipes prevent spoilage before it happens.'
                : 'As you rescue expiring items and cook zero-waste dishes, your cumulative savings will appear here.'}
            </p>
          </div>

          {/* Net Savings Callout Card */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg">
                ₹
              </div>
              <div>
                <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Net Wallet Savings</p>
                <h4 className="text-lg sm:text-xl font-extrabold text-emerald-950">
                  ₹{selectedPeriod === 'annual' ? stats.annualRupeesSaved.toLocaleString('en-IN') : Math.round(stats.annualRupeesSaved / 12).toLocaleString('en-IN')} Saved
                </h4>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs">
              {stats.annualRupeesSaved > 0
                ? `Equivalent to ${(stats.annualRupeesSaved / 5000).toFixed(1)} Months of Free Groceries!`
                : 'Log pantry items & cook rescued meals to grow savings!'}
            </span>
          </div>

        </div>

        {/* Category Breakdown (Benchmark Guide) */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
            Indian Household Waste Reduction Guide:
          </h4>
          <p className="text-[11px] text-slate-500 mb-3">
            Average Indian kitchen waste patterns and recommended zero-waste cooking interventions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>🥛 Fresh Dairy (Milk, Paneer, Dahi)</span>
                <span className="text-emerald-700">High Risk</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">1-2 days shelf life. Best repurposed for Kadhi, Paneer Bhurji, Chhachh & Chai.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>🥬 Perishable Greens (Palak, Kothmir)</span>
                <span className="text-emerald-700">Medium Risk</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">2-4 days shelf life. Blanch or blend into gravies, Green Chutneys & Dal Tadka.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>🌾 Dry Pantry & Spices</span>
                <span className="text-emerald-700">Low Risk</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">60-180 days. Smart grocery list prevents duplicate purchases at DMart & Kirana.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
