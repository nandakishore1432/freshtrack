export type ItemCategory =
  | 'dairy'
  | 'vegetables'
  | 'staples'
  | 'spices'
  | 'snacks'
  | 'bakery'
  | 'fruits'
  | 'other';

export type StorageLocation = 'fridge' | 'pantry' | 'freezer';

export interface PantryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: string;
  purchaseDate: string;
  daysLeft: number; // <= 2 days is High Urgency tier (<= 48 hrs)
  estimatedPrice: number;
  source: 'receipt' | 'quick_commerce' | 'manual';
  receiptRawText?: string;
  notes?: string;
  consumed?: boolean;
  storageType?: StorageLocation;
  expiryDate?: string;
  isCustomExpiry?: boolean;
}

export interface ParsedItem {
  id: string;
  rawText: string;
  name: string;
  category: ItemCategory;
  quantity: string;
  estimatedDaysLeft: number;
  price: number;
  selected: boolean;
  storageType?: StorageLocation;
}

export interface SubstitutionOption {
  name: string;
  hindiName?: string;
  ratio: string;
  flavorNote: string;
  flavorProfile: string;
  isMasalaDabba?: boolean;
  availableInPantry?: boolean;
}

export interface IngredientSubstitution {
  targetIngredient: string;
  primaryFlavorProfile: string;
  alternatives: SubstitutionOption[];
}

export interface CommunityRecipe {
  id: string;
  title: string;
  hindiName?: string;
  authorName: string;
  authorLocation: string;
  authorAvatar?: string;
  description: string;
  imageEmoji: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Quick' | 'Easy' | 'Medium';
  dishType: 'Sabzi & Curry' | 'Dal & Rice' | 'Snack & Breakfast' | 'Roti & Paratha' | 'Dessert & Chutney';
  ingredients: {
    name: string;
    quantity: string;
    zeroWasteOrigin?: string;
  }[];
  instructions: string[];
  zeroWasteStory: string;
  tags: string[];
  ratingsCount: number;
  averageRating: number;
  userRating?: number;
  isSaved?: boolean;
  createdAt: string;
  savesCount?: number;
  estimatedRupeeSaved?: number;
  zeroWasteTip?: string;
}

export type ListingCondition = 'Fresh' | 'Sealed / Unopened' | 'Good Condition' | 'Surplus Stock';
export type ListingStatus = 'Active' | 'Sold';

export interface GroceryListing {
  id: string;
  name: string;
  hindiName?: string;
  quantity: string;
  price: number;
  category: ItemCategory;
  expiryDate: string;
  condition: ListingCondition;
  status: ListingStatus;
  location?: string;
  createdAt?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity?: string;
  category: ItemCategory | string;
  urgency: 'high' | 'medium' | 'low' | 'urgent' | 'regular' | 'restock';
  suggestedReason?: string;
  reason?: string;
  estimatedPrice: number;
  checked: boolean;
  storeSection?: 'Sabzi Mandi' | 'Dairy & Fresh' | 'Kirana & Grains' | 'Spices & Essentials' | 'Bakery & Snacks';
  sourceRecipeTitle?: string;
  notes?: string;
}

export interface ShelfLifePrediction {
  defaultDays: number;
  suggestedStorage: StorageLocation;
  storageTips: {
    roomTempDays: number;
    refrigeratedDays: number;
    frozenDays?: number;
    preservationHack: string;
  };
  reason: string;
}

export interface Recipe {
  id: string;
  title: string;
  hindiName?: string;
  description: string;
  imageEmoji: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Quick' | 'Easy' | 'Medium';
  usesExpiringPercent: number;
  missingIngredientsCount: number;
  rupeeSaved: number;
  tags: string[];
  pantryIngredients: { name: string; isExpiring?: boolean }[];
  masalaDabbaSpices: string[];
  missingIngredients: string[];
  instructions: string[];
  chefTip?: string;
  dishType: 'Sabzi & Curry' | 'Dal & Rice' | 'Snack & Breakfast' | 'Roti & Paratha';
}

export interface UserProfile {
  name: string;
  household: string;
  city: string;
  dietaryPreference: 'Vegetarian' | 'Non-Vegetarian' | 'Jain (No Onion/Garlic)' | 'Vegan';
  isPureVeg: boolean;
  activeQuickCommerceSync: boolean;
  memberCount: number;
}

export interface WasteSavingsStats {
  annualRupeesSaved: number;
  unmanagedWasteRupees: number;
  freshTrackWasteRupees: number;
  kgFoodSavedThisMonth: number;
  totalMealsRescued: number;
  co2PreventedKg: number;
}
