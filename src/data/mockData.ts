import { PantryItem, Recipe, UserProfile, WasteSavingsStats, ParsedItem } from '../types';

export const INITIAL_PANTRY_ITEMS: PantryItem[] = [];

export const DEMO_RECEIPTS: {
  id: string;
  name: string;
  store: string;
  type: string;
  date: string;
  rawText: string;
  parsedItems: ParsedItem[];
}[] = [];

export const RECIPES: Recipe[] = [];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Home Chef',
  household: 'My Household',
  city: 'India',
  dietaryPreference: 'Vegetarian',
  isPureVeg: true,
  activeQuickCommerceSync: false,
  memberCount: 2
};

export const INITIAL_STATS: WasteSavingsStats = {
  annualRupeesSaved: 0,
  unmanagedWasteRupees: 0,
  freshTrackWasteRupees: 0,
  kgFoodSavedThisMonth: 0,
  totalMealsRescued: 0,
  co2PreventedKg: 0
};

export const MASALA_DABBA_ITEMS = [
  { id: 'haldi', name: 'Haldi (Turmeric)', hindi: 'हल्दी', color: 'bg-amber-400', fillLevel: '85%', benefits: 'Antiseptic & Golden Color' },
  { id: 'jeera', name: 'Sabut Jeera (Cumin)', hindi: 'जीरा', color: 'bg-stone-600', fillLevel: '70%', benefits: 'Earthy Aroma & Digestion' },
  { id: 'rai', name: 'Rai (Mustard Seeds)', hindi: 'राई', color: 'bg-amber-950', fillLevel: '90%', benefits: 'Pungent Tadka Pop' },
  { id: 'lal_mirch', name: 'Deggi Mirch (Chilli)', hindi: 'लाल मिर्च', color: 'bg-red-600', fillLevel: '65%', benefits: 'Vibrant Red Warmth' },
  { id: 'dhaniya', name: 'Dhaniya (Coriander)', hindi: 'धनिया पाउडर', color: 'bg-yellow-700', fillLevel: '80%', benefits: 'Citrus Body & Gravy' },
  { id: 'garam_masala', name: 'Garam Masala', hindi: 'गरम मसाला', color: 'bg-amber-900', fillLevel: '60%', benefits: 'Warming Finishing Spice' },
  { id: 'salt', name: 'Sendha / Kala Namak', hindi: 'नमक', color: 'bg-slate-200', fillLevel: '95%', benefits: 'Flavor Foundation' }
];
