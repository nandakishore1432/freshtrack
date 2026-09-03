import React, { useState } from 'react';
import {
  ChefHat,
  Clock,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Utensils,
  Share2,
  X,
  Plus,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Filter,
  Users,
  Repeat,
  ShoppingCart,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe, PantryItem, CommunityRecipe } from '../types';
import { findSubstitutionsForMissingIngredient } from '../utils/substitutions';
import { SubstitutionsModal } from './SubstitutionsModal';
import { CommunityRecipeHub } from './CommunityRecipeHub';

interface RecipeEngineProps {
  recipes: Recipe[];
  pantryItems: PantryItem[];
  masalaDabbaActive: boolean;
  filterByIngredient: string | null;
  onClearFilter: () => void;
  onCookRecipe: (recipe: Recipe) => void;
  communityRecipes?: CommunityRecipe[];
  onAddCommunityRecipe?: (newRecipe: Omit<CommunityRecipe, 'id' | 'createdAt' | 'ratingsCount' | 'savesCount'>) => void;
  onSaveCommunityRecipeToCollection?: (recipe: CommunityRecipe) => void;
  onRateCommunityRecipe?: (recipeId: string, rating: number) => void;
  onAddToGroceryList?: (item: { name: string; category: string; urgency: 'high' | 'medium' | 'low'; notes?: string }) => void;
}

export const RecipeEngine: React.FC<RecipeEngineProps> = ({
  recipes,
  pantryItems,
  masalaDabbaActive,
  filterByIngredient,
  onClearFilter,
  onCookRecipe,
  communityRecipes = [],
  onAddCommunityRecipe,
  onSaveCommunityRecipeToCollection,
  onRateCommunityRecipe,
  onAddToGroceryList
}) => {
  // Top view mode: 'ai_engine' or 'community'
  const [activeViewMode, setActiveViewMode] = useState<'ai_engine' | 'community'>('ai_engine');
  const [isSubstitutionsModalOpen, setIsSubstitutionsModalOpen] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | '100%_expiring' | 'quick' | 'curry'>('all');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiCustomRecipes, setAiCustomRecipes] = useState<Recipe[]>([]);
  const [cookingSuccessRecipe, setCookingSuccessRecipe] = useState<Recipe | null>(null);
  const [appliedSubstitutions, setAppliedSubstitutions] = useState<{ [recipeId: string]: { [missing: string]: string } }>({});
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Expiring items in pantry
  const expiringItems = pantryItems.filter((i) => i.daysLeft <= 2);

  // Combine curated + generated recipes
  const allRecipes = [...aiCustomRecipes, ...recipes];

  // Filter recipes
  const filteredRecipes = allRecipes.filter((recipe) => {
    if (filterByIngredient) {
      const matchIngredient =
        recipe.pantryIngredients.some(
          (i) =>
            i.name.toLowerCase().includes(filterByIngredient.toLowerCase()) ||
            filterByIngredient.toLowerCase().includes(i.name.toLowerCase())
        ) || recipe.title.toLowerCase().includes(filterByIngredient.toLowerCase());

      if (!matchIngredient) return false;
    }

    if (activeTabFilter === '100%_expiring') {
      return recipe.usesExpiringPercent >= 90;
    }
    if (activeTabFilter === 'quick') {
      return recipe.prepTime.includes('5') || recipe.prepTime.includes('10');
    }
    if (activeTabFilter === 'curry') {
      return recipe.dishType === 'Sabzi & Curry';
    }
    return true;
  });

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => setNotificationMessage(null), 3500);
  };

  // Swap missing ingredient with an Indian substitute
  const handleApplySubstitution = (recipeId: string, missingItem: string, substituteName: string) => {
    setAppliedSubstitutions((prev) => ({
      ...prev,
      [recipeId]: {
        ...(prev[recipeId] || {}),
        [missingItem]: substituteName
      }
    }));

    // If modal is currently viewing this recipe, update it
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          missingIngredients: prev.missingIngredients.filter((m) => m !== missingItem),
          missingIngredientsCount: Math.max(0, prev.missingIngredientsCount - 1),
          pantryIngredients: [
            ...prev.pantryIngredients,
            { name: `${substituteName} (Substituted for ${missingItem})`, isExpiring: false }
          ]
        };
      });
    }

    showNotification(`Swapped ${missingItem} with ${substituteName}! Flavor profile matched.`);
  };

  // Call AI Recipe endpoint
  const handleGenerateAiRecipe = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/ai-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expiringItems: expiringItems.map((i) => `${i.name} (${i.quantity}, ${i.daysLeft}d left)`),
          pantryItems: pantryItems.map((i) => i.name),
          masalaDabbaAvailable: masalaDabbaActive,
          mealType: 'Desi Zero-Waste Meal'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.recipe) {
          const newAiRecipe: Recipe = {
            id: `ai-recipe-${Date.now()}`,
            title: data.recipe.title,
            hindiName: data.recipe.hindiName,
            description: data.recipe.chefTip || 'Custom chef recipe crafted to rescue your immediate expiring groceries.',
            imageEmoji: '✨🍲',
            prepTime: data.recipe.prepTime || '15 mins',
            cookTime: data.recipe.cookTime || '15 mins',
            difficulty: 'Quick',
            usesExpiringPercent: data.recipe.usesExpiringPercent || 100,
            missingIngredientsCount: data.recipe.missingIngredientsCount || 0,
            rupeeSaved: data.recipe.rupeeSaved || 150,
            tags: data.recipe.tags || ['AI Generated', 'Uses 100% Expiring Items'],
            dishType: 'Sabzi & Curry',
            pantryIngredients: (data.recipe.pantryIngredients || []).map((name: string) => ({
              name,
              isExpiring: true
            })),
            masalaDabbaSpices: data.recipe.masalaDabbaSpices || [
              'Jeera',
              'Haldi',
              'Lal Mirch',
              'Mustard Oil',
              'Salt'
            ],
            missingIngredients: data.recipe.missingIngredients || [],
            instructions: data.recipe.instructions || [
              'Temper jeera in hot mustard oil.',
              'Add chopped expiring greens and spices.',
              'Cook on medium flame for 5 minutes and serve fresh!'
            ],
            chefTip: data.recipe.chefTip
          };

          setAiCustomRecipes((prev) => [newAiRecipe, ...prev]);
          setSelectedRecipe(newAiRecipe);
        }
      }
    } catch (err) {
      console.warn('AI Recipe error:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Celebrate with Confetti when user cooks zero-waste meal!
  const handleCookThis = (recipe: Recipe) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });

    onCookRecipe(recipe);
    setCookingSuccessRecipe(recipe);
    setSelectedRecipe(null);

    setTimeout(() => {
      setCookingSuccessRecipe(null);
    }, 4000);
  };

  return (
    <div id="zero-waste-recipe-engine" className="space-y-6 animate-in fade-in duration-300">
      
      {/* View Switcher: AI Engine vs Community Kitchen + Substitutions Guide */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-emerald-100 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveViewMode('ai_engine')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeViewMode === 'ai_engine'
                ? 'bg-[#046A38] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Zero-Waste AI Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode('community')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeViewMode === 'community'
                ? 'bg-[#046A38] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Community Kitchen</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded-full font-bold">
              {communityRecipes.length}
            </span>
          </button>
        </div>

        {/* Indian Substitutions Guide Modal Button */}
        <button
          type="button"
          onClick={() => setIsSubstitutionsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-2xs"
        >
          <Repeat className="w-4 h-4 text-amber-700" />
          <span>Desi Substitutions Guide 🌿</span>
        </button>
      </div>

      {/* Toast Notification */}
      {notificationMessage && (
        <div className="p-3 bg-emerald-700 text-white rounded-xl shadow-md text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>{notificationMessage}</span>
          </div>
          <button type="button" onClick={() => setNotificationMessage(null)} className="text-white/80 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* RENDER COMMUNITY RECIPES TAB */}
      {activeViewMode === 'community' && (
        <CommunityRecipeHub
          communityRecipes={communityRecipes}
          pantryItems={pantryItems}
          masalaDabbaActive={masalaDabbaActive}
          onAddRecipe={onAddCommunityRecipe || (() => {})}
          onSaveToPersonalCollection={(r) => {
            if (onSaveCommunityRecipeToCollection) {
              onSaveCommunityRecipeToCollection(r);
              showNotification(`Saved "${r.title}" to your zero-waste recipe collection!`);
            }
          }}
          onRateRecipe={onRateCommunityRecipe || (() => {})}
        />
      )}

      {/* RENDER ZERO-WASTE AI ENGINE TAB */}
      {activeViewMode === 'ai_engine' && (
        <>
          {/* Engine Banner - Vibrant Palette */}
          <div className="bg-[#046A38] text-white p-6 rounded-2xl shadow-md border border-emerald-800 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
            
            <div className="max-w-xl relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 text-xs font-bold mb-2">
                <ChefHat className="w-3.5 h-3.5 text-yellow-300" /> Zero-Waste Desi AI Engine
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Cook What&apos;s Expiring, Save What&apos;s Sacred
              </h2>
              <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 leading-relaxed">
                Recipes dynamically prioritized by ingredients with &le; 48 hours left. Masala Dabba spices and intelligent Indian substitutions automatically factored in.
              </p>
            </div>

            {/* AI Recipe Generator CTA */}
            <button
              id="ai-recipe-generator-btn"
              type="button"
              onClick={handleGenerateAiRecipe}
              disabled={isGeneratingAI}
              className="relative z-10 shrink-0 px-4 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-700 animate-spin" />
              <span>{isGeneratingAI ? 'Generating AI Recipe...' : 'Ask AI Chef to Rescue Pantry'}</span>
            </button>
          </div>

          {/* Filter Ribbon & Section Title */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                🍲 ZERO-WASTE DESI RECIPES ({filteredRecipes.length})
              </h2>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                USES 100% EXPIRING ITEMS
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'All Recipes' },
                  { id: '100%_expiring', label: '🔥 Uses 100% Expiring Items' },
                  { id: 'quick', label: '⚡ Under 20 Mins' },
                  { id: 'curry', label: '🍲 Sabzi & Curries' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeTabFilter === tab.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Active Ingredient Filter Tag if user clicked "Cook Now" on screen 2 */}
              {filterByIngredient && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-xs px-3 py-1.5 rounded-full">
                  <span>Filtered by: <strong>{filterByIngredient}</strong></span>
                  <button
                    type="button"
                    onClick={onClearFilter}
                    className="p-0.5 hover:bg-red-200 rounded-full cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cooking Success Flash Banner */}
          {cookingSuccessRecipe && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-emerald-900 animate-in fade-in slide-in-from-top-2 shadow-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-bold">
                    Shabash! You cooked {cookingSuccessRecipe.title} ({cookingSuccessRecipe.hindiName})!
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Pantry ingredients updated. Saved approx ₹{cookingSuccessRecipe.rupeeSaved} in wasted food!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* RECIPE CARDS GRID */}
          {filteredRecipes.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-emerald-100 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-3xl mx-auto mb-3">
                🍲
              </div>
              <h3 className="text-base font-bold text-slate-800">No Recipes in Engine</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Scan your grocery bills or add items to your Smart Pantry, then tap &ldquo;Ask AI Chef to Rescue Pantry&rdquo; to generate custom zero-waste Indian meals.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerateAiRecipe}
                  disabled={isGeneratingAI}
                  className="px-4 py-2 bg-[#046A38] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#03552d] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Generate AI Recipes</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRecipes.map((recipe, index) => {
              const bannerGradients = [
                'from-emerald-100 to-yellow-50 text-emerald-800',
                'from-amber-100 to-orange-50 text-orange-800',
                'from-teal-100 to-emerald-50 text-teal-800'
              ];
              const bannerGrad = bannerGradients[index % bannerGradients.length];

              // Check if recipe has substitutions applied
              const recipeSubs = appliedSubstitutions[recipe.id] || {};
              const effectiveMissing = recipe.missingIngredients.filter((m) => !recipeSubs[m]);

              return (
                <div
                  key={recipe.id}
                  id={`recipe-card-${recipe.id}`}
                  className="bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Vibrant Top Visual Header */}
                  <div className={`h-24 bg-gradient-to-r ${bannerGrad} p-3 flex items-center justify-between relative`}>
                    <div className="text-4xl filter drop-shadow-xs group-hover:scale-110 transition-transform">
                      {recipe.imageEmoji}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="bg-white/80 backdrop-blur-xs text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                        ⚡ {recipe.prepTime}
                      </span>
                      <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                        Saves ₹{recipe.rupeeSaved}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-800 transition-colors">
                          {recipe.title}
                        </h3>
                        {recipe.hindiName && (
                          <span className="text-xs text-slate-500 font-hindi font-medium">
                            ({recipe.hindiName})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        {recipe.description}
                      </p>

                      {/* Requirement Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {recipe.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              tag.includes('100%')
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : tag.includes('Missing 0')
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Ingredients preview */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          From Your Pantry:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {recipe.pantryIngredients.map((ing, i) => (
                            <span
                              key={i}
                              className={`text-[11px] px-2 py-0.5 rounded-md ${
                                ing.isExpiring
                                  ? 'bg-red-50 text-red-800 font-bold border border-red-200'
                                  : 'bg-slate-100 text-slate-700 font-medium'
                              }`}
                            >
                              {ing.isExpiring ? '⚠️ ' : ''}{ing.name.split(' ')[0]}
                            </span>
                          ))}
                          {masalaDabbaActive && (
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-semibold border border-amber-200">
                              + Masala Dabba
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Missing Ingredients & Smart Indian Substitutions Box */}
                      {effectiveMissing.length > 0 ? (
                        <div className="mt-3 p-2.5 bg-amber-50/90 rounded-xl border border-amber-200 text-xs space-y-2">
                          <p className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                            Missing: {effectiveMissing.join(', ')}
                          </p>
                          
                          {/* Suggest common Indian substitutions */}
                          {effectiveMissing.slice(0, 1).map((missing, mIdx) => {
                            const match = findSubstitutionsForMissingIngredient(missing, pantryItems, masalaDabbaActive);
                            if (!match) return null;
                            const topSub = match.substitutions[0];
                            if (!topSub) return null;

                            return (
                              <div key={mIdx} className="bg-white p-2 rounded-lg border border-amber-200/80">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-emerald-800">
                                    💡 Desi Swap: {topSub.name}
                                  </span>
                                  {topSub.isAvailableInPantry && (
                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.2 rounded">
                                      In Pantry ✓
                                    </span>
                                  )}
                                  {topSub.isInMasalaDabba && (
                                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded">
                                      In Masala Dabba ✓
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">{topSub.flavorNote}</p>
                                <div className="mt-1.5 flex items-center justify-between gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleApplySubstitution(recipe.id, missing, topSub.name)}
                                    className="text-[10px] font-black text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded cursor-pointer"
                                  >
                                    Swap in Recipe
                                  </button>
                                  {onAddToGroceryList && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onAddToGroceryList({
                                          name: missing,
                                          category: 'Vegetables & Produce',
                                          urgency: 'medium',
                                          notes: `Needed for ${recipe.title}`
                                        });
                                        showNotification(`Added ${missing} to your Smart Grocery List!`);
                                      }}
                                      className="text-[10px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                                    >
                                      <ShoppingCart className="w-3 h-3" />
                                      <span>Add to List</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mt-2.5 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>0 missing ingredients! Ready to cook.</span>
                        </div>
                      )}
                    </div>

                    {recipe.chefTip && (
                      <p className="text-[10px] font-bold text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/50 mt-3 truncate">
                        ⚡ CHATPATI TIP: {recipe.chefTip}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Bar with COOK Action Button */}
                  <div className="p-3 bg-white flex justify-between items-center text-xs border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedRecipe(recipe)}
                      className="text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      View Steps &rarr;
                    </button>
                    <button
                      id={`quick-cook-btn-${recipe.id}`}
                      type="button"
                      onClick={() => handleCookThis(recipe)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer"
                    >
                      COOK
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
          )}
        </>
      )}

      {/* RECIPE DETAIL VIEW MODAL WITH INDIAN SUBSTITUTIONS ENGINE */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-[#046A38] text-white flex items-start justify-between relative">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {selectedRecipe.imageEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                      {selectedRecipe.dishType}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                      ₹{selectedRecipe.rupeeSaved} Food Rescued
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold mt-1">
                    {selectedRecipe.title} {selectedRecipe.hindiName && <span className="font-hindi text-base opacity-90 font-normal">({selectedRecipe.hindiName})</span>}
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1 max-w-lg">
                    {selectedRecipe.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 flex-1">
              
              {/* Timing & Tags bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
                <div className="flex items-center gap-4 text-emerald-900 font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" /> Prep: {selectedRecipe.prepTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-600" /> Cook: {selectedRecipe.cookTime}
                  </span>
                  <span>Serves: 2-3 Desi Portions</span>
                </div>
                <span className="font-bold text-[#046A38] bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                  {selectedRecipe.tags[0]}
                </span>
              </div>

              {/* Ingredients Divided: In Pantry vs Masala Dabba vs Missing Substitutions */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-[#046A38]" /> Ingredients Breakdown
                </h4>

                {/* 1. In Your Smart Pantry */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>In Your Pantry (Already Stocked)</span>
                    </p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Ready to use
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedRecipe.pantryIngredients.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#046A38] shrink-0" />
                        <span className="truncate">{item.name}</span>
                        {item.isExpiring && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded shrink-0">
                            Expiring &le;48h
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. From Your Masala Dabba */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <span>🥘 From Your Indian Masala Dabba</span>
                    </p>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                      Auto-supplied
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRecipe.masalaDabbaSpices.map((spice, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md bg-white border border-amber-200 text-amber-900 font-medium"
                      >
                        ✓ {spice}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Missing Ingredients with Indian Substitutions Engine */}
                {selectedRecipe.missingIngredients.length > 0 ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-700" />
                        <span>Missing Ingredients & Flavor-Aligned Indian Substitutions</span>
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {selectedRecipe.missingIngredients.map((missing, idx) => {
                        const match = findSubstitutionsForMissingIngredient(missing, pantryItems, masalaDabbaActive);

                        return (
                          <div key={idx} className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-slate-800">
                                Missing: {missing}
                              </span>
                              {match && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                  Role: {match.flavorRole}
                                </span>
                              )}
                            </div>

                            {match && match.substitutions.length > 0 ? (
                              <div className="space-y-1.5">
                                <p className="text-[11px] font-bold text-emerald-800">Desi Substitutions:</p>
                                {match.substitutions.map((sub, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-center justify-between text-xs gap-2"
                                  >
                                    <div>
                                      <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                                        <span>✓ {sub.name}</span>
                                        {sub.isAvailableInPantry && (
                                          <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-black">
                                            In Pantry!
                                          </span>
                                        )}
                                        {sub.isInMasalaDabba && (
                                          <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-black">
                                            In Masala Dabba!
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-slate-600 mt-0.5">
                                        {sub.flavorNote} ({sub.usageRatio})
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleApplySubstitution(selectedRecipe.id, missing, sub.name)}
                                      className="px-2.5 py-1 text-[11px] font-black bg-emerald-700 hover:bg-emerald-800 text-white rounded-md cursor-pointer whitespace-nowrap"
                                    >
                                      Use Substitute
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-500 italic">
                                No direct culinary substitute found. Consider purchasing or making without it.
                              </p>
                            )}

                            {onAddToGroceryList && (
                              <button
                                type="button"
                                onClick={() => {
                                  onAddToGroceryList({
                                    name: missing,
                                    category: 'Vegetables & Produce',
                                    urgency: 'medium',
                                    notes: `Needed for ${selectedRecipe.title}`
                                  });
                                  showNotification(`Added ${missing} to your Smart Grocery List!`);
                                }}
                                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 pt-1"
                              >
                                <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
                                <span>Or add &quot;{missing}&quot; to Smart Grocery List</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5 px-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span><strong>0 Missing Ingredients!</strong> You have everything needed right now in your kitchen.</span>
                  </div>
                )}
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#046A38]" /> Step-by-Step Cooking Guide (Desi Method)
                </h4>

                <ol className="space-y-2.5">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed"
                    >
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                {selectedRecipe.chefTip && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <strong className="font-bold">🧑‍🍳 Zero-Waste Chef Tip:</strong> {selectedRecipe.chefTip}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer with "I Cooked This!" button */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>

              <button
                id="modal-cook-this-btn"
                type="button"
                onClick={() => handleCookThis(selectedRecipe)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#046A38] hover:bg-emerald-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-300" />
                <span>I Cooked This! (Update Pantry)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DESI INGREDIENT SUBSTITUTIONS MODAL */}
      <SubstitutionsModal
        isOpen={isSubstitutionsModalOpen}
        onClose={() => setIsSubstitutionsModalOpen(false)}
        pantryItems={pantryItems}
        masalaDabbaActive={masalaDabbaActive}
      />

    </div>
  );
};
