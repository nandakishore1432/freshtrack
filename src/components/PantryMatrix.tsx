import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Flame,
  ChefHat,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Snowflake,
  Trash2,
  Check,
  ShieldCheck,
  Tag,
  Info,
  Calendar,
  IndianRupee,
  Layers,
  Thermometer,
  Box,
  Sparkles,
  Edit3
} from 'lucide-react';
import { PantryItem, ItemCategory, StorageLocation } from '../types';
import { predictShelfLife, calculateExpiryDateString } from '../utils/expiryPredictor';
import { OverrideExpiryModal } from './OverrideExpiryModal';

interface PantryMatrixProps {
  items: PantryItem[];
  masalaDabbaActive: boolean;
  onToggleMasalaDabba: () => void;
  onCookNow: (ingredientName: string) => void;
  onMarkConsumed: (id: string) => void;
  onExtendShelfLife: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (newItem: Omit<PantryItem, 'id'>) => void;
  onUpdateItem?: (updatedItem: PantryItem) => void;
  onOpenMasalaDabbaModal: () => void;
}

export const PantryMatrix: React.FC<PantryMatrixProps> = ({
  items,
  masalaDabbaActive,
  onToggleMasalaDabba,
  onCookNow,
  onMarkConsumed,
  onExtendShelfLife,
  onDeleteItem,
  onAddItem,
  onUpdateItem,
  onOpenMasalaDabbaModal
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [itemForExpiryOverride, setItemForExpiryOverride] = useState<PantryItem | null>(null);

  // Form state for adding custom grocery item with AI predictive expiry
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('vegetables');
  const [newItemQuantity, setNewItemQuantity] = useState<string>('500g');
  const [newItemStorage, setNewItemStorage] = useState<StorageLocation>('fridge');
  const [newItemDaysLeft, setNewItemDaysLeft] = useState<number>(2);
  const [newItemPrice, setNewItemPrice] = useState<number>(40);
  const [manualExpiryDate, setManualExpiryDate] = useState<string>('');

  // Live shelf-life prediction
  const activePrediction = predictShelfLife(newItemName || 'Greens', newItemCategory, newItemStorage);

  const handleNameChange = (name: string) => {
    setNewItemName(name);
    const pred = predictShelfLife(name, newItemCategory, newItemStorage);
    setNewItemDaysLeft(pred.defaultDays);
    setManualExpiryDate(calculateExpiryDateString(pred.defaultDays));
  };

  const handleCategoryChange = (cat: ItemCategory) => {
    setNewItemCategory(cat);
    const pred = predictShelfLife(newItemName, cat, newItemStorage);
    setNewItemDaysLeft(pred.defaultDays);
    setManualExpiryDate(calculateExpiryDateString(pred.defaultDays));
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.receiptRawText && item.receiptRawText.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // TIER 1: 🔴 High Urgency Tier (<= 48 Hours / <= 2 days)
  const highUrgencyItems = filteredItems.filter((i) => i.daysLeft <= 2);

  // TIER 2: 🟢 Stable Pantry Tier (15+ Days)
  const stablePantryItems = filteredItems.filter((i) => i.daysLeft >= 15);

  // Medium Urgency (3-14 days)
  const mediumUrgencyItems = filteredItems.filter((i) => i.daysLeft > 2 && i.daysLeft < 15);

  const handleCreateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQuantity || '1 unit',
      purchaseDate: new Date().toISOString().split('T')[0],
      daysLeft: Number(newItemDaysLeft),
      estimatedPrice: Number(newItemPrice),
      source: 'manual',
      storageType: newItemStorage,
      expiryDate: manualExpiryDate || calculateExpiryDateString(Number(newItemDaysLeft)),
      notes: `Stored in ${newItemStorage}`
    });

    setNewItemName('');
    setIsAddModalOpen(false);
  };

  const handleSaveExpiryOverride = (updated: PantryItem) => {
    if (onUpdateItem) {
      onUpdateItem(updated);
    }
  };

  return (
    <div id="predictive-pantry-matrix" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Bar: Search, Category Filters, Masala Dabba Toggle & Add Item */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-emerald-100 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="pantry-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Palak, Paneer, Atta, Toor Dal..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-emerald-100 rounded-xl focus:outline-hidden focus:border-[#046A38] focus:bg-white transition-colors font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Masala Dabba Quick Toggle in Bar */}
            <div
              onClick={onOpenMasalaDabbaModal}
              id="masala-dabba-toggle-bar"
              className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 hover:bg-emerald-100 transition-colors shrink-0 shadow-2xs"
              title="Click to view your Indian Masala Dabba Spices"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-bold hidden xs:inline">MASALA DABBA:</span>
              <span className="text-xs font-black text-emerald-800">
                {masalaDabbaActive ? 'ACTIVE' : 'OFF'}
              </span>
            </div>

            {/* Quick Add Button */}
            <button
              id="quick-add-pantry-item-btn"
              type="button"
              onClick={() => {
                const pred = predictShelfLife('Fresh Greens', 'vegetables', 'fridge');
                setNewItemDaysLeft(pred.defaultDays);
                setManualExpiryDate(calculateExpiryDateString(pred.defaultDays));
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#046A38] hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Items', icon: '🧺' },
            { id: 'dairy', label: 'Fresh Dairy', icon: '🥛' },
            { id: 'vegetables', label: 'Vegetables & Greens', icon: '🥬' },
            { id: 'staples', label: 'Chakki & Staples', icon: '🌾' },
            { id: 'spices', label: 'Spices & Oils', icon: '🌶️' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🔴 TIER 1: HIGH URGENCY TIER (<= 48 HOURS) */}
      <section id="high-urgency-tier" className="bg-white rounded-2xl shadow-xs border border-emerald-100 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span>🔴 HIGH URGENCY (CRITICAL &le; 48 HOURS)</span>
          </h2>
          <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            &le; 48H
          </span>
        </div>

        {highUrgencyItems.length === 0 ? (
          <div className="p-6 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-emerald-900 text-sm">Zero Food Waste Alert!</p>
            <p className="text-xs text-emerald-700 mt-0.5">No high urgency groceries currently expiring in the next 48 hours.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {highUrgencyItems.map((item) => {
              const isOneDay = item.daysLeft <= 1;
              const pred = predictShelfLife(item.name, item.category, item.storageType);

              return (
                <div
                  key={item.id}
                  id={`high-urgency-card-${item.id}`}
                  className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm ${
                    isOneDay
                      ? 'bg-red-50/80 border-red-200 hover:border-red-300'
                      : 'bg-orange-50/80 border-orange-200 hover:border-orange-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className={`text-[10px] font-black uppercase tracking-wider ${
                            isOneDay ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {isOneDay ? 'Expires Tomorrow' : `Expires in ${item.daysLeft} days`}
                          </p>
                          {item.isCustomExpiry && (
                            <span className="text-[9px] bg-white border border-slate-300 text-slate-600 px-1 py-0.2 rounded font-bold">
                              Override
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base mt-0.5 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity} • Value: ₹{item.estimatedPrice}</p>
                      </div>

                      {/* Prominent COOK Button */}
                      <button
                        id={`cook-now-btn-${item.id}`}
                        type="button"
                        onClick={() => onCookNow(item.name)}
                        className={`text-[11px] px-3 py-1.5 rounded-lg font-black uppercase tracking-wider text-white shadow-xs hover:scale-102 transition-all cursor-pointer ${
                          isOneDay
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-orange-500 hover:bg-orange-600'
                        }`}
                      >
                        COOK
                      </button>
                    </div>

                    {/* Preservation Hack Tip */}
                    <div className="mt-2.5 p-2 bg-white/80 rounded-lg border border-red-100 text-[11px] text-slate-600">
                      <span className="font-bold text-red-800">Storage Tip: </span>
                      {pred.storageTips.preservationHack}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-red-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setItemForExpiryOverride(item)}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-md border border-slate-200"
                    >
                      <Edit3 className="w-3 h-3 text-slate-500" />
                      <span>Edit Expiry</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onExtendShelfLife(item.id)}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-sky-600 transition-colors"
                        title="Freeze / Pickled (+7 days)"
                      >
                        <Snowflake className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMarkConsumed(item.id)}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-emerald-700 transition-colors"
                        title="Mark Cooked / Consumed"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 🟡 TIER 2: MEDIUM URGENCY (3-14 DAYS) */}
      <section className="bg-white rounded-2xl shadow-xs border border-emerald-100 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span>🟡 CONSUME SOON (3 TO 14 DAYS)</span>
          </h2>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            {mediumUrgencyItems.length} ITEMS
          </span>
        </div>

        {mediumUrgencyItems.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">No medium urgency items.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {mediumUrgencyItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/80 hover:border-emerald-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          {item.daysLeft} days left
                        </span>
                        {item.isCustomExpiry && (
                          <span className="text-[9px] bg-white border border-slate-300 text-slate-500 px-1 py-0.2 rounded">
                            Set
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm mt-1">{item.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity} • ₹{item.estimatedPrice}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onCookNow(item.name)}
                      className="text-[10px] font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md"
                    >
                      Cook
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setItemForExpiryOverride(item)}
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Override Expiry</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onMarkConsumed(item.id)}
                      className="p-1 text-slate-400 hover:text-emerald-700"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🟢 TIER 3: STABLE PANTRY TIER (15+ DAYS) */}
      <section className="bg-white rounded-2xl shadow-xs border border-emerald-100 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span>🟢 STABLE PANTRY & CHAKKI STAPLES (15+ DAYS)</span>
          </h2>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            {stablePantryItems.length} ITEMS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {stablePantryItems.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/80 flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-xs text-slate-800">{item.name}</h4>
                <p className="text-[11px] text-slate-500">{item.quantity} • {item.daysLeft}d left</p>
              </div>
              <button
                type="button"
                onClick={() => setItemForExpiryOverride(item)}
                className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-white"
                title="Override Expiry Date"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* OVERRIDE EXPIRY MODAL */}
      <OverrideExpiryModal
        isOpen={Boolean(itemForExpiryOverride)}
        onClose={() => setItemForExpiryOverride(null)}
        item={itemForExpiryOverride}
        onSave={handleSaveExpiryOverride}
      />

      {/* MANUAL ADD ITEM MODAL WITH PREDICTIVE EXPIRY ASSIGNMENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-emerald-100 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-[#046A38] text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-base">Add Indian Grocery to Pantry</h3>
                <p className="text-xs text-emerald-100 opacity-90">Auto-predicts shelf life & storage tips</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateItemSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Palak, Amul Paneer, Aashirvaad Atta, Tamatar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* AI Prediction preview badge */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                <div className="flex items-center justify-between font-bold text-[11px] text-emerald-900">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI Expiry Prediction:
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                    {activePrediction.defaultDays} Days ({manualExpiryDate})
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{activePrediction.storageTips.preservationHack}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => handleCategoryChange(e.target.value as ItemCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="vegetables">🥬 Vegetables & Greens</option>
                    <option value="dairy">🥛 Fresh Dairy</option>
                    <option value="staples">🌾 Chakki & Staples</option>
                    <option value="spices">🌶️ Spices & Oils</option>
                    <option value="bakery">🍞 Bakery & Bread</option>
                    <option value="fruits">🍎 Fresh Fruits</option>
                    <option value="snacks">🥨 Dry Snacks</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    placeholder="e.g. 500g, 1L, 2 Bunches"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Storage Condition</label>
                  <select
                    value={newItemStorage}
                    onChange={(e) => {
                      const st = e.target.value as StorageLocation;
                      setNewItemStorage(st);
                      const pred = predictShelfLife(newItemName, newItemCategory, st);
                      setNewItemDaysLeft(pred.defaultDays);
                      setManualExpiryDate(calculateExpiryDateString(pred.defaultDays));
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="fridge">🧊 Refrigerator</option>
                    <option value="pantry">🌾 Cool Pantry Dabba</option>
                    <option value="freezer">❄️ Deep Freezer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Manual Override Inputs */}
              <div className="pt-1">
                <label className="block font-bold text-slate-700 mb-1">Override Days or Expiry Date</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="730"
                    value={newItemDaysLeft}
                    onChange={(e) => {
                      const d = parseInt(e.target.value) || 1;
                      setNewItemDaysLeft(d);
                      setManualExpiryDate(calculateExpiryDateString(d));
                    }}
                    className="w-24 px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  />
                  <input
                    type="date"
                    value={manualExpiryDate}
                    onChange={(e) => setManualExpiryDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#046A38] hover:bg-emerald-800 text-white shadow-xs cursor-pointer"
                >
                  Add to Smart Pantry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
