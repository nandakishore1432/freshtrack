import React, { useState, useEffect } from 'react';
import {
  Camera,
  ShoppingBag,
  ChefHat,
  BarChart3,
  Flame,
  Leaf,
  Sparkles,
  Info,
  ShoppingCart,
  CheckCircle2
} from 'lucide-react';

import {
  PantryItem,
  Recipe,
  UserProfile,
  WasteSavingsStats,
  ParsedItem,
  GroceryItem,
  CommunityRecipe
} from './types';
import {
  INITIAL_PANTRY_ITEMS,
  RECIPES,
  INITIAL_USER_PROFILE,
  INITIAL_STATS
} from './data/mockData';
import { COMMUNITY_RECIPES } from './data/communityRecipesData';
import { predictShelfLife, calculateExpiryDateString } from './utils/expiryPredictor';

import { Header } from './components/Header';
import { ScanIngestionHub } from './components/ScanIngestionHub';
import { PantryMatrix } from './components/PantryMatrix';
import { RecipeEngine } from './components/RecipeEngine';
import { SmartGroceryList } from './components/SmartGroceryList';
import { AnalyticsSavings } from './components/AnalyticsSavings';
import { MasalaDabbaModal } from './components/MasalaDabbaModal';
import { UserProfileModal } from './components/UserProfileModal';

export default function App() {
  // Navigation active tab: 'scan' | 'pantry' | 'recipes' | 'grocery' | 'analytics'
  const [activeTab, setActiveTab] = useState<'scan' | 'pantry' | 'recipes' | 'grocery' | 'analytics'>('pantry');

  // Pantry State (persisted in localStorage)
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem('freshtrack_pantry_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((it: PantryItem) => it && it.id && !it.id.startsWith('item-'));
        }
      } catch (e) {
        console.warn('Failed to parse saved pantry items', e);
      }
    }
    return INITIAL_PANTRY_ITEMS;
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('freshtrack_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.name !== 'Sunita Sharma') {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_USER_PROFILE;
  });

  // Analytics Stats
  const [stats, setStats] = useState<WasteSavingsStats>(() => {
    const saved = localStorage.getItem('freshtrack_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.annualRupeesSaved !== 10450) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_STATS;
  });

  // Community Recipes State
  const [communityRecipes, setCommunityRecipes] = useState<CommunityRecipe[]>(() => {
    const saved = localStorage.getItem('freshtrack_community_recipes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((r: CommunityRecipe) => r && r.id && !r.id.startsWith('comm-'));
        }
      } catch (e) {}
    }
    return COMMUNITY_RECIPES;
  });

  // Smart Grocery List State (analyzes expiring/low items & planned meals)
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('freshtrack_grocery_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((g: GroceryItem) => g && g.id && !['g-1', 'g-2', 'g-3', 'g-4'].includes(g.id));
        }
      } catch (e) {}
    }
    return [];
  });

  // Active Recipes (Curated + Community saved)
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('freshtrack_user_recipes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((r: Recipe) => r && r.id && !r.id.startsWith('recipe-'));
        }
      } catch (e) {}
    }
    return RECIPES;
  });

  // Masala Dabba default-on toggle
  const [masalaDabbaActive, setMasalaDabbaActive] = useState<boolean>(true);
  const [isMasalaDabbaModalOpen, setIsMasalaDabbaModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Recipe filter triggered from Screen 2 "Cook Now" button
  const [recipeIngredientFilter, setRecipeIngredientFilter] = useState<string | null>(null);

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('freshtrack_pantry_items', JSON.stringify(pantryItems));
  }, [pantryItems]);

  useEffect(() => {
    localStorage.setItem('freshtrack_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('freshtrack_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('freshtrack_grocery_items', JSON.stringify(groceryItems));
  }, [groceryItems]);

  useEffect(() => {
    localStorage.setItem('freshtrack_community_recipes', JSON.stringify(communityRecipes));
  }, [communityRecipes]);

  useEffect(() => {
    localStorage.setItem('freshtrack_user_recipes', JSON.stringify(recipes));
  }, [recipes]);

  // High Urgency Items (<= 48 Hours)
  const expiringItems = pantryItems.filter((i) => i.daysLeft <= 2);
  const expiringCount = expiringItems.length;
  // Pending grocery items count
  const pendingGroceryCount = groceryItems.filter((g) => !g.checked).length;

  // Handler: Add Parsed Items from Scan Ingestion Hub to Smart Pantry with predictive shelf life
  const handleAddItemsToPantry = (parsedItems: ParsedItem[]) => {
    const newItems: PantryItem[] = parsedItems.map((p) => {
      const pred = predictShelfLife(p.name, p.category, 'fridge');
      const days = p.estimatedDaysLeft || pred.defaultDays;

      return {
        id: `pantry-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: p.name,
        category: p.category,
        quantity: p.quantity,
        purchaseDate: new Date().toISOString().split('T')[0],
        daysLeft: days,
        estimatedPrice: p.price,
        source: 'receipt' as const,
        receiptRawText: p.rawText,
        storageType: 'fridge',
        expiryDate: calculateExpiryDateString(days),
        notes: pred.storageTips.preservationHack
      };
    });

    setPantryItems((prev) => [...newItems, ...prev]);
  };

  // Handler: Cook Now clicked on high urgency item in Screen 2
  const handleCookNowFromPantry = (ingredientName: string) => {
    setRecipeIngredientFilter(ingredientName);
    setActiveTab('recipes');
  };

  // Handler: Mark item consumed / cooked
  const handleMarkItemConsumed = (id: string) => {
    const found = pantryItems.find((i) => i.id === id);
    if (!found) return;

    // Remove from active list
    setPantryItems((prev) => prev.filter((i) => i.id !== id));

    // Increase savings
    setStats((prev) => ({
      ...prev,
      annualRupeesSaved: prev.annualRupeesSaved + found.estimatedPrice,
      kgFoodSavedThisMonth: +(prev.kgFoodSavedThisMonth + 0.3).toFixed(1),
      totalMealsRescued: prev.totalMealsRescued + 1,
      co2PreventedKg: +(prev.co2PreventedKg + 0.8).toFixed(1)
    }));
  };

  // Handler: Freeze / Extend shelf life
  const handleExtendShelfLife = (id: string) => {
    setPantryItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, daysLeft: i.daysLeft + 7, notes: 'Frozen / Pickled (+7 days)' } : i))
    );
  };

  // Handler: Delete item
  const handleDeleteItem = (id: string) => {
    setPantryItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Handler: Add manual item
  const handleAddManualItem = (newItem: Omit<PantryItem, 'id'>) => {
    const item: PantryItem = {
      ...newItem,
      id: `manual-${Date.now()}`
    };
    setPantryItems((prev) => [item, ...prev]);
  };

  // Handler: Update pantry item (e.g. from OverrideExpiryModal)
  const handleUpdatePantryItem = (updatedItem: PantryItem) => {
    setPantryItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  // Handler: User completes cooking a recipe from Screen 3
  const handleCookRecipe = (recipe: Recipe) => {
    const expiringIngredientNames = recipe.pantryIngredients
      .filter((i) => i.isExpiring)
      .map((i) => i.name.toLowerCase());

    if (expiringIngredientNames.length > 0) {
      setPantryItems((prev) =>
        prev.filter((item) => {
          const isUsed = expiringIngredientNames.some(
            (name) => item.name.toLowerCase().includes(name) || name.includes(item.name.toLowerCase())
          );
          return !isUsed;
        })
      );
    }

    setStats((prev) => ({
      ...prev,
      annualRupeesSaved: prev.annualRupeesSaved + recipe.rupeeSaved,
      kgFoodSavedThisMonth: +(prev.kgFoodSavedThisMonth + 0.5).toFixed(1),
      totalMealsRescued: prev.totalMealsRescued + 1,
      co2PreventedKg: +(prev.co2PreventedKg + 1.2).toFixed(1)
    }));
  };

  // Grocery List Handlers
  const handleAddGroceryItem = (newItem: Omit<GroceryItem, 'id'>) => {
    const item: GroceryItem = {
      ...newItem,
      id: `g-${Date.now()}-${Math.random().toString(36).substring(2, 4)}`
    };
    setGroceryItems((prev) => [item, ...prev]);
  };

  const handleToggleGroceryItem = (id: string) => {
    setGroceryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDeleteGroceryItem = (id: string) => {
    setGroceryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCompletedGrocery = () => {
    setGroceryItems((prev) => prev.filter((item) => !item.checked));
  };

  // Transfer purchased grocery items into Smart Pantry with auto-predicted shelf life
  const handleMoveCheckedGroceryToPantry = (itemsToMove: GroceryItem[]) => {
    const newPantryEntries: PantryItem[] = itemsToMove.map((g) => {
      // Predict shelf life based on name
      const pred = predictShelfLife(g.name, 'vegetables', 'fridge');

      return {
        id: `pantry-bought-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        name: g.name,
        category:
          g.category.includes('Dairy')
            ? 'dairy'
            : g.category.includes('Lentil') || g.category.includes('Grain')
            ? 'staples'
            : g.category.includes('Spice')
            ? 'spices'
            : 'vegetables',
        quantity: '1 Unit',
        purchaseDate: new Date().toISOString().split('T')[0],
        daysLeft: pred.defaultDays,
        estimatedPrice: g.estimatedPrice || 50,
        source: 'manual',
        storageType: 'fridge',
        expiryDate: calculateExpiryDateString(pred.defaultDays),
        notes: `Imported from Smart Grocery List • ${pred.storageTips.preservationHack}`
      };
    });

    setPantryItems((prev) => [...newPantryEntries, ...prev]);
    // Remove moved items from grocery list
    setGroceryItems((prev) => prev.filter((g) => !itemsToMove.some((m) => m.id === g.id)));
  };

  // Community Recipe Handlers
  const handleAddCommunityRecipe = (
    newRecipeData: Omit<CommunityRecipe, 'id' | 'createdAt' | 'ratingsCount'>
  ) => {
    const created: CommunityRecipe = {
      ...newRecipeData,
      id: `comm-rec-${Date.now()}`,
      createdAt: 'Just now',
      ratingsCount: 1,
      savesCount: 0
    };
    setCommunityRecipes((prev) => [created, ...prev]);
  };

  const handleSaveCommunityRecipeToCollection = (commRecipe: CommunityRecipe) => {
    // Add to personal recipes if not already present
    const exists = recipes.some((r) => r.title.toLowerCase() === commRecipe.title.toLowerCase());
    if (!exists) {
      const personalRecipe: Recipe = {
        id: `saved-${commRecipe.id}`,
        title: commRecipe.title,
        hindiName: commRecipe.hindiName,
        description: commRecipe.description,
        imageEmoji: commRecipe.imageEmoji,
        prepTime: commRecipe.prepTime,
        cookTime: commRecipe.cookTime,
        difficulty: 'Easy',
        usesExpiringPercent: 85,
        missingIngredientsCount: 0,
        rupeeSaved: commRecipe.estimatedRupeeSaved || 120,
        tags: [...commRecipe.tags, 'Community Pick'],
        dishType: 'Sabzi & Curry',
        pantryIngredients: commRecipe.ingredients.map((ing) => ({
          name: `${ing.name} (${ing.quantity})`,
          isExpiring: false
        })),
        masalaDabbaSpices: ['Haldi', 'Jeera', 'Lal Mirch', 'Salt'],
        missingIngredients: [],
        instructions: commRecipe.instructions,
        chefTip: commRecipe.zeroWasteTip || commRecipe.zeroWasteStory
      };
      setRecipes((prev) => [personalRecipe, ...prev]);
    }

    // Increment savesCount in community recipe list
    setCommunityRecipes((prev) =>
      prev.map((c) => (c.id === commRecipe.id ? { ...c, savesCount: (c.savesCount || 0) + 1, isSaved: true } : c))
    );
  };

  const handleRateCommunityRecipe = (recipeId: string, rating: number) => {
    setCommunityRecipes((prev) =>
      prev.map((c) => {
        if (c.id === recipeId) {
          const newCount = c.ratingsCount + 1;
          const newRating = +( (c.rating * c.ratingsCount + rating) / newCount ).toFixed(1);
          return {
            ...c,
            rating: newRating,
            ratingsCount: newCount
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-slate-800 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Header */}
      <Header
        userProfile={userProfile}
        annualSavings={stats.annualRupeesSaved}
        expiringCount={expiringCount}
        expiringItemNames={expiringItems.map((i) => i.name)}
        masalaDabbaActive={masalaDabbaActive}
        onToggleMasalaDabba={() => setMasalaDabbaActive(!masalaDabbaActive)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenMasalaDabbaModal={() => setIsMasalaDabbaModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 pb-24 md:pb-12">
        {activeTab === 'scan' && (
          <ScanIngestionHub
            onAddItemsToPantry={handleAddItemsToPantry}
            onNavigateToPantry={() => setActiveTab('pantry')}
          />
        )}

        {activeTab === 'pantry' && (
          <PantryMatrix
            items={pantryItems}
            masalaDabbaActive={masalaDabbaActive}
            onToggleMasalaDabba={() => setMasalaDabbaActive(!masalaDabbaActive)}
            onCookNow={handleCookNowFromPantry}
            onMarkConsumed={handleMarkItemConsumed}
            onExtendShelfLife={handleExtendShelfLife}
            onDeleteItem={handleDeleteItem}
            onAddItem={handleAddManualItem}
            onUpdateItem={handleUpdatePantryItem}
            onOpenMasalaDabbaModal={() => setIsMasalaDabbaModalOpen(true)}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipeEngine
            recipes={recipes}
            pantryItems={pantryItems}
            masalaDabbaActive={masalaDabbaActive}
            filterByIngredient={recipeIngredientFilter}
            onClearFilter={() => setRecipeIngredientFilter(null)}
            onCookRecipe={handleCookRecipe}
            communityRecipes={communityRecipes}
            onAddCommunityRecipe={handleAddCommunityRecipe}
            onSaveCommunityRecipeToCollection={handleSaveCommunityRecipeToCollection}
            onRateCommunityRecipe={handleRateCommunityRecipe}
            onAddToGroceryList={(item) =>
              handleAddGroceryItem({
                name: item.name,
                category: item.category,
                urgency: item.urgency,
                checked: false,
                reason: item.notes || 'Needed for recipe',
                estimatedPrice: 35
              })
            }
          />
        )}

        {activeTab === 'grocery' && (
          <SmartGroceryList
            items={groceryItems}
            pantryItems={pantryItems}
            onAddItem={handleAddGroceryItem}
            onToggleItem={handleToggleGroceryItem}
            onDeleteItem={handleDeleteGroceryItem}
            onClearCompleted={handleClearCompletedGrocery}
            onMoveToPantry={handleMoveCheckedGroceryToPantry}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsSavings stats={stats} />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav id="bottom-app-nav-bar" className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 shadow-lg">
        <div className="max-w-md md:max-w-3xl mx-auto px-3 py-2 flex items-center justify-around">
          
          {/* Tab 1: Scan / Ingest */}
          <button
            id="nav-tab-scan"
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'scan'
                ? 'text-[#046A38] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'scan' ? 'bg-[#046A38] text-white shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-1 font-bold uppercase tracking-wider">Scan</span>
          </button>

          {/* Tab 2: Smart Pantry */}
          <button
            id="nav-tab-pantry"
            type="button"
            onClick={() => setActiveTab('pantry')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
              activeTab === 'pantry'
                ? 'text-[#046A38] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'pantry' ? 'bg-[#046A38] text-white shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-1 font-bold uppercase tracking-wider">Pantry</span>
            {expiringCount > 0 && (
              <span className="absolute top-0 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {expiringCount}
              </span>
            )}
          </button>

          {/* Tab 3: Desi Recipes & Community */}
          <button
            id="nav-tab-recipes"
            type="button"
            onClick={() => {
              setRecipeIngredientFilter(null);
              setActiveTab('recipes');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'recipes'
                ? 'text-[#046A38] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'recipes' ? 'bg-[#046A38] text-white shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
              <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-1 font-bold uppercase tracking-wider">Recipes</span>
          </button>

          {/* Tab 4: Smart Grocery List */}
          <button
            id="nav-tab-grocery"
            type="button"
            onClick={() => setActiveTab('grocery')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
              activeTab === 'grocery'
                ? 'text-[#046A38] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'grocery' ? 'bg-[#046A38] text-white shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-1 font-bold uppercase tracking-wider">Grocery</span>
            {pendingGroceryCount > 0 && (
              <span className="absolute top-0 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {pendingGroceryCount}
              </span>
            )}
          </button>

          {/* Tab 5: Analytics & Savings */}
          <button
            id="nav-tab-analytics"
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'text-[#046A38] font-black scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-[#046A38] text-white shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-1 font-bold uppercase tracking-wider">Savings</span>
          </button>

        </div>
      </nav>

      {/* Masala Dabba Modal */}
      <MasalaDabbaModal
        isOpen={isMasalaDabbaModalOpen}
        onClose={() => setIsMasalaDabbaModalOpen(false)}
        active={masalaDabbaActive}
        onToggleActive={(val) => setMasalaDabbaActive(val)}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onUpdateProfile={(updated) => setUserProfile(updated)}
      />

    </div>
  );
}
