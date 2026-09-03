import { ItemCategory, ShelfLifePrediction, StorageLocation } from '../types';

interface PredictionRule {
  keywords: string[];
  category: ItemCategory;
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

const INDIAN_EXPIRY_RULES: PredictionRule[] = [
  // Leafy Greens & Herbs (Highest Perishability in Indian Climate)
  {
    keywords: ['palak', 'spinach', 'coriander', 'kothmir', 'dhaniya', 'methi', 'fenugreek', 'pudina', 'mint', 'curry leaves', 'kadi patta'],
    category: 'vegetables',
    defaultDays: 2,
    suggestedStorage: 'fridge',
    storageTips: {
      roomTempDays: 1,
      refrigeratedDays: 3,
      frozenDays: 30,
      preservationHack: 'Wrap stems in dry newspaper or cotton cloth inside an airtight dabba. Do NOT wash until right before cooking.'
    },
    reason: 'Leafy greens wilt and oxidize rapidly due to moisture buildup and tropical ambient temperatures.'
  },

  // Fresh Dairy (High Perishability)
  {
    keywords: ['milk', 'doodh', 'paneer', 'dahi', 'curd', 'yogurt', 'chaas', 'buttermilk', 'khoya', 'malai'],
    category: 'dairy',
    defaultDays: 3,
    suggestedStorage: 'fridge',
    storageTips: {
      roomTempDays: 1,
      refrigeratedDays: 4,
      frozenDays: 60,
      preservationHack: 'Keep paneer submerged in a bowl of clean cold water inside the fridge, changing water every 24 hours to extend shelf life up to 5 days.'
    },
    reason: 'Live cultures in unpasteurized or opened Indian dairy sour quickly above 8°C.'
  },

  // Tender Vegetables & Gourds
  {
    keywords: ['tomato', 'tamatar', 'capsicum', 'shimla', 'bhindi', 'okra', 'ladyfinger', 'beans', 'french beans', 'gobhi', 'cauliflower', 'cabbage', 'baingan', 'brinjal', 'lauki', 'bottle gourd', 'tori', 'ridge gourd', 'karela'],
    category: 'vegetables',
    defaultDays: 6,
    suggestedStorage: 'fridge',
    storageTips: {
      roomTempDays: 3,
      refrigeratedDays: 7,
      frozenDays: 45,
      preservationHack: 'Wipe bhindi completely dry before storing; keep tomatoes stem-side down at room temp until ripe, then refrigerate.'
    },
    reason: 'Moisture accumulation causes surface condensation and mold spots on Indian tender vegetables.'
  },

  // Hardy Root Vegetables & Alliums
  {
    keywords: ['aloo', 'potato', 'pyaaz', 'onion', 'lahsun', 'garlic', 'adrak', 'ginger', 'arbi', 'sweet potato', 'shakarkandi'],
    category: 'vegetables',
    defaultDays: 20,
    suggestedStorage: 'pantry',
    storageTips: {
      roomTempDays: 21,
      refrigeratedDays: 28,
      preservationHack: 'Store in an open wicker tokri in a dark, airy corner. Keep potatoes and onions strictly apart as onions release ethylene gas that triggers potato sprouting.'
    },
    reason: 'Low natural respiration rate allows hardy tubers to remain stable at room temperature if ventilated.'
  },

  // Bakery & Fresh Breads
  {
    keywords: ['bread', 'pav', 'ladi pav', 'bun', 'thepla', 'roti', 'paratha', 'chapati', 'kulcha', 'naan'],
    category: 'bakery',
    defaultDays: 3,
    suggestedStorage: 'pantry',
    storageTips: {
      roomTempDays: 3,
      refrigeratedDays: 7,
      frozenDays: 90,
      preservationHack: 'Double-wrap fresh pav in foil and freeze. To revive, steam for 30 seconds or toast with generous butter.'
    },
    reason: 'High moisture and lack of chemical preservatives cause green surface mold after 72 hours.'
  },

  // Pulses, Dals, Grains & Flours
  {
    keywords: ['atta', 'flour', 'wheat', 'rice', 'chawal', 'basmati', 'dal', 'toor', 'moong', 'chana', 'urad', 'masoor', 'besan', 'suji', 'rawa', 'poha', 'sabudana'],
    category: 'staples',
    defaultDays: 120,
    suggestedStorage: 'pantry',
    storageTips: {
      roomTempDays: 150,
      refrigeratedDays: 240,
      preservationHack: 'Place 2-3 dried whole red chillies or dried neem leaves inside the stainless steel dabba to naturally deter weevils (ghun).'
    },
    reason: 'Extremely low water activity provides prolonged stability against spoilage organisms.'
  },

  // Spices & Cooking Oils
  {
    keywords: ['haldi', 'turmeric', 'mirchi', 'chilli powder', 'jeera', 'cumin', 'mustard', 'rai', 'coriander powder', 'dhaniya powder', 'garam masala', 'ghee', 'oil', 'hing', 'salt'],
    category: 'spices',
    defaultDays: 300,
    suggestedStorage: 'pantry',
    storageTips: {
      roomTempDays: 365,
      refrigeratedDays: 365,
      preservationHack: 'Keep masala dabba away from direct stove steam; spoon out with bone-dry spoons to preserve aroma oils.'
    },
    reason: 'Essential spice oils preserve integrity when shielded from ambient humidity.'
  },

  // Fresh Fruits
  {
    keywords: ['banana', 'kela', 'apple', 'seb', 'mango', 'aam', 'papaya', 'papita', 'orange', 'santra', 'grapes', 'angoor', 'guava', 'amrood', 'pomegranate', 'anaar'],
    category: 'fruits',
    defaultDays: 5,
    suggestedStorage: 'fridge',
    storageTips: {
      roomTempDays: 3,
      refrigeratedDays: 7,
      frozenDays: 60,
      preservationHack: 'Wrap banana stems in cling film to slow ethylene release. Chill grapes unwashed in perforated containers.'
    },
    reason: 'Climacteric fruit respiration causes softening and sugar fermentation.'
  }
];

// Fallback predictions by general category
const CATEGORY_DEFAULT_PREDICTIONS: Record<ItemCategory, ShelfLifePrediction> = {
  dairy: {
    defaultDays: 3,
    suggestedStorage: 'fridge',
    storageTips: {
      roomTempDays: 1,
      refrigeratedDays: 4,
      frozenDays: 45,
      preservationHack: 'Refrigerate immediately at <= 4°C. Boil raw milk within 2 hours.'
    },
    reason: 'Standard fresh dairy shelf-life in Indian household refrigerators.'
  },
  vegetables: {
    defaultDays: 5,
    suggestedStorage: 'fridge',
    storageTips: {
      roomTempDays: 2,
      refrigeratedDays: 6,
      frozenDays: 30,
      preservationHack: 'Segregate leafy produce from root veggies in breathable cotton fridge bags.'
    },
    reason: 'Standard Indian vegetable crisper longevity.'
  },
  staples: {
    defaultDays: 120,
    suggestedStorage: 'pantry',
    storageTips: {
      roomTempDays: 180,
      refrigeratedDays: 240,
      preservationHack: 'Store in airtight steel canisters away from direct sunlight.'
    },
    reason: 'Dry grain pantry stability.'
  },
  spices: {
    defaultDays: 300,
    suggestedStorage: 'pantry',
    storageTips: {
      roomTempDays: 365,
      refrigeratedDays: 365,
      preservationHack: 'Keep airtight in your Masala Dabba.'
    },
    reason: 'Natural antimicrobial essential spice oils.'
  },
  bakery: {
    defaultDays: 3,
    suggestedStorage: 'pantry',
    storageTips: {
      roomTempDays: 3,
      refrigeratedDays: 6,
      frozenDays: 60,
      preservationHack: 'Freeze sliced bread or double seal.'
    },
    reason: 'Fresh bakery starch retrogradation & fungal sensitivity.'
  },
  fruits: {
    defaultDays: 5,
    suggestedStorage: 'fridge',
    storageTips: {
      roomTempDays: 3,
      refrigeratedDays: 7,
      frozenDays: 60,
      preservationHack: 'Store separately from vegetables.'
    },
    reason: 'Tropical fruit ethylene sensitivity.'
  },
  snacks: {
    defaultDays: 45,
    suggestedStorage: 'pantry',
    storageTips: {
      roomTempDays: 45,
      refrigeratedDays: 60,
      preservationHack: 'Seal in airtight dabbas with moisture-absorbing food-safe tissue.'
    },
    reason: 'Moisture ingress causes crisp snacks to lose crunch.'
  },
  other: {
    defaultDays: 14,
    suggestedStorage: 'pantry',
    storageTips: {
      roomTempDays: 14,
      refrigeratedDays: 28,
      preservationHack: 'Check manufacturer stamp and store in cool dry place.'
    },
    reason: 'Standard dry grocery estimate.'
  }
};

/**
 * Predicts the shelf life days, storage method, and preservation tip for an Indian grocery item.
 */
export function predictShelfLife(
  itemName: string,
  category: ItemCategory,
  storageOverride?: StorageLocation
): ShelfLifePrediction {
  const nameLower = itemName.toLowerCase().trim();

  // Search keyword rules first
  const matchedRule = INDIAN_EXPIRY_RULES.find((rule) =>
    rule.keywords.some((kw) => nameLower.includes(kw))
  );

  let prediction: ShelfLifePrediction;

  if (matchedRule) {
    prediction = {
      defaultDays: matchedRule.defaultDays,
      suggestedStorage: matchedRule.suggestedStorage,
      storageTips: matchedRule.storageTips,
      reason: matchedRule.reason
    };
  } else {
    // Fall back to category-based intelligence
    prediction = CATEGORY_DEFAULT_PREDICTIONS[category] || CATEGORY_DEFAULT_PREDICTIONS.other;
  }

  // If user has selected a storage location, dynamically adjust predicted days
  if (storageOverride) {
    let adjustedDays = prediction.defaultDays;
    if (storageOverride === 'freezer') {
      adjustedDays = prediction.storageTips.frozenDays || prediction.defaultDays + 30;
    } else if (storageOverride === 'fridge') {
      adjustedDays = Math.max(prediction.storageTips.refrigeratedDays, prediction.defaultDays);
    } else if (storageOverride === 'pantry') {
      adjustedDays = prediction.storageTips.roomTempDays || prediction.defaultDays;
    }

    return {
      ...prediction,
      suggestedStorage: storageOverride,
      defaultDays: adjustedDays
    };
  }

  return prediction;
}

/**
 * Calculates a target calendar date string (YYYY-MM-DD) from current date + daysLeft.
 */
export function calculateExpiryDateString(daysLeft: number): string {
  const target = new Date();
  target.setDate(target.getDate() + Math.max(0, daysLeft));
  return target.toISOString().split('T')[0];
}

/**
 * Calculates days left from a specific date string.
 */
export function calculateDaysLeftFromDateString(expiryDateStr: string): number {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(expiryDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  } catch (e) {
    return 3;
  }
}
