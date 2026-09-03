import React, { useState } from 'react';
import {
  Users,
  Star,
  Bookmark,
  BookmarkCheck,
  Plus,
  Search,
  Filter,
  Heart,
  Share2,
  Clock,
  Sparkles,
  ChefHat,
  X,
  CheckCircle2,
  Leaf,
  ArrowRight
} from 'lucide-react';
import { CommunityRecipe } from '../types';

interface CommunityRecipeHubProps {
  communityRecipes: CommunityRecipe[];
  onRateRecipe: (recipeId: string, rating: number) => void;
  onToggleSaveRecipe: (recipeId: string) => void;
  onAddCommunityRecipe: (recipe: CommunityRecipe) => void;
  onCookRecipe?: (recipe: any) => void;
}

export const CommunityRecipeHub: React.FC<CommunityRecipeHubProps> = ({
  communityRecipes,
  onRateRecipe,
  onToggleSaveRecipe,
  onAddCommunityRecipe,
  onCookRecipe
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'saved' | 'snack' | 'sabzi' | 'dal'>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<CommunityRecipe | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState<{ recipeId: string; star: number } | null>(null);

  // New Recipe Form State
  const [newTitle, setNewTitle] = useState('');
  const [newHindiName, setNewHindiName] = useState('');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorLocation, setNewAuthorLocation] = useState('');
  const [newDishType, setNewDishType] = useState<CommunityRecipe['dishType']>('Sabzi & Curry');
  const [newDescription, setNewDescription] = useState('');
  const [newImageEmoji, setNewImageEmoji] = useState('🍲');
  const [newPrepTime, setNewPrepTime] = useState('10 mins');
  const [newCookTime, setNewCookTime] = useState('15 mins');
  const [newZeroWasteStory, setNewZeroWasteStory] = useState('');
  const [newIngredientsText, setNewIngredientsText] = useState('Leftover Roti (3 pcs) - Yesterday evening\nDahi (1/2 cup) - Turning sour\nMustard Seeds (1 tsp) - Masala dabba');
  const [newInstructionsText, setNewInstructionsText] = useState('Tear rotis into small pieces.\nHeat 1 tbsp oil, splutter mustard seeds and curry leaves.\nWhisk sour curd with water and spices, pour in and simmer.\nAdd roti pieces and cook for 3 minutes until tender.');
  const [newTagsText, setNewTagsText] = useState('#RotiRescue, #DesiZeroWaste, #QuickBreakfast');

  // Filter recipes
  const filteredRecipes = communityRecipes.filter((r) => {
    // Search query
    const matchSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.hindiName && r.hindiName.includes(searchTerm)) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.zeroWasteStory.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (activeFilter === 'saved') return r.isSaved;
    if (activeFilter === 'snack') return r.dishType === 'Snack & Breakfast';
    if (activeFilter === 'sabzi') return r.dishType === 'Sabzi & Curry';
    if (activeFilter === 'dal') return r.dishType === 'Dal & Rice';

    return true;
  });

  const savedCount = communityRecipes.filter((r) => r.isSaved).length;

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthorName.trim()) return;

    // Parse ingredients lines
    const parsedIngredients = newIngredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('-');
        const namePart = parts[0] || '';
        const originPart = parts[1] ? parts[1].trim() : 'Kitchen zero-waste staple';
        return {
          name: namePart.trim(),
          quantity: 'As needed',
          zeroWasteOrigin: originPart
        };
      });

    // Parse instructions
    const parsedInstructions = newInstructionsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    // Parse tags
    const parsedTags = newTagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const recipeToSave: CommunityRecipe = {
      id: `comm-${Date.now()}`,
      title: newTitle.trim(),
      hindiName: newHindiName.trim() || undefined,
      authorName: newAuthorName.trim(),
      authorLocation: newAuthorLocation.trim() || 'India',
      authorAvatar: '👩🏽‍🍳',
      description: newDescription.trim() || 'Traditional home-cooked zero-waste Indian dish.',
      imageEmoji: newImageEmoji || '🍲',
      prepTime: newPrepTime,
      cookTime: newCookTime,
      difficulty: 'Easy',
      dishType: newDishType,
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : [{ name: 'Leftovers', quantity: '1 bowl', zeroWasteOrigin: 'Pantry rescue' }],
      instructions: parsedInstructions.length > 0 ? parsedInstructions : ['Combine ingredients and cook with temperings.'],
      zeroWasteStory: newZeroWasteStory.trim() || 'Every scrap of food has culinary value when spiced with love.',
      tags: parsedTags.length > 0 ? parsedTags : ['#ZeroWasteDesi'],
      ratingsCount: 1,
      averageRating: 5.0,
      userRating: 5,
      isSaved: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddCommunityRecipe(recipeToSave);
    setIsShareModalOpen(false);
    setSelectedRecipe(recipeToSave);

    // Reset form
    setNewTitle('');
    setNewHindiName('');
    setNewDescription('');
    setNewZeroWasteStory('');
  };

  return (
    <div id="community-recipe-hub" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Community Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-[#046A38] text-white p-6 rounded-2xl shadow-lg border border-emerald-700 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-white/10 rounded-full pointer-events-none" />

        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5 text-yellow-300" /> Desi Community Kitchen
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            India&apos;s Zero-Waste Community Recipes
          </h2>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 leading-relaxed">
            Discover time-tested regional hacks from grandmother kitchens across India — turning watermelon rinds, stale rotis, and cauliflower stalks into culinary masterpieces.
          </p>
        </div>

        <button
          id="share-recipe-open-btn"
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="relative z-10 shrink-0 px-4 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Share Your Recipe</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All Recipes (${communityRecipes.length})` },
            { id: 'saved', label: `Saved Collection (${savedCount})` },
            { id: 'sabzi', label: '🍲 Sabzi & Curries' },
            { id: 'snack', label: '🫓 Breakfast & Snacks' },
            { id: 'dal', label: '🥣 Kadhi & Dals' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search rind, roti, stalks..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-medium"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
            >
              ×
            </button>
          )}
        </div>

      </div>

      {/* Community Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecipes.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200">
            <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-extrabold text-slate-800 text-base">No community recipes found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {activeFilter === 'saved'
                ? "You haven't saved any community recipes to your collection yet. Click the bookmark icon on any recipe to save it here!"
                : 'Try adjusting your search query or be the first to share your own zero-waste family hack!'}
            </p>
            {activeFilter === 'saved' && (
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Browse All Recipes
              </button>
            )}
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Top Visual */}
              <div className="h-28 bg-gradient-to-r from-emerald-100 via-amber-50 to-emerald-50 p-3.5 flex items-center justify-between relative">
                <div className="text-4xl filter drop-shadow-xs group-hover:scale-110 transition-transform">
                  {recipe.imageEmoji}
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  {/* Save to Collection Bookmark */}
                  <button
                    type="button"
                    title={recipe.isSaved ? 'Remove from Saved' : 'Save to My Collection'}
                    onClick={() => onToggleSaveRecipe(recipe.id)}
                    className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer shadow-xs ${
                      recipe.isSaved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/80 text-slate-600 hover:text-emerald-700 hover:bg-white'
                    }`}
                  >
                    {recipe.isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>

                  <span className="text-[10px] font-black bg-white/90 text-emerald-950 px-2 py-0.5 rounded-full shadow-2xs">
                    ⏱️ {recipe.cookTime}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <span>{recipe.authorAvatar || '👩🏽‍🍳'}</span> {recipe.authorName} • <span className="text-slate-400">{recipe.authorLocation}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                      {recipe.dishType}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {recipe.title}
                  </h3>
                  {recipe.hindiName && (
                    <p className="text-xs text-slate-500 font-hindi font-medium mt-0.5">
                      {recipe.hindiName}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Zero Waste Story Quote Snippet */}
                  <div className="mt-3 p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-900 font-medium">
                    <span className="font-bold text-emerald-800">🌱 Zero-Waste Hack: </span>
                    <span className="line-clamp-2">{recipe.zeroWasteStory}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {recipe.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating({ recipeId: recipe.id, star })}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => onRateRecipe(recipe.id, star)}
                          className="p-0.5 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              (hoverRating?.recipeId === recipe.id
                                ? star <= hoverRating.star
                                : star <= Math.round(recipe.averageRating))
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-800 ml-1">
                      {recipe.averageRating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({recipe.ratingsCount})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedRecipe(recipe)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Recipe</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* RECIPE DETAIL VIEW MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-[#046A38] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-3xl border border-white/20">
                  {selectedRecipe.imageEmoji}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black">{selectedRecipe.title}</h3>
                  {selectedRecipe.hindiName && (
                    <p className="text-xs text-emerald-100 font-hindi font-medium">
                      {selectedRecipe.hindiName}
                    </p>
                  )}
                  <p className="text-[11px] text-emerald-200 mt-0.5">
                    By {selectedRecipe.authorName} • {selectedRecipe.authorLocation}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleSaveRecipe(selectedRecipe.id)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    selectedRecipe.isSaved
                      ? 'bg-yellow-400 text-emerald-950 border-yellow-300'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                  title="Save Recipe"
                >
                  {selectedRecipe.isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRecipe(null)}
                  className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              
              {/* Zero-Waste Story Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-black text-emerald-950 uppercase tracking-wider text-[11px]">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" /> The Zero-Waste Story
                </div>
                <p className="text-emerald-900 leading-relaxed font-medium">
                  {selectedRecipe.zeroWasteStory}
                </p>
              </div>

              {/* Time & Rating Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Prep: {selectedRecipe.prepTime}
                  </span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    ⚡ Cook: {selectedRecipe.cookTime}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">Community Rating:</span>
                  <span className="font-black text-amber-600 flex items-center gap-1">
                    ⭐ {selectedRecipe.averageRating.toFixed(1)} ({selectedRecipe.ratingsCount} reviews)
                  </span>
                </div>
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-2.5">
                  Ingredients & Zero-Waste Origins
                </h4>
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="font-bold text-slate-800">
                        {ing.name} <span className="text-slate-500 font-normal">({ing.quantity})</span>
                      </div>
                      {ing.zeroWasteOrigin && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          ♻️ {ing.zeroWasteOrigin}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by step Instructions */}
              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-2.5">
                  Step-by-Step Method
                </h4>
                <div className="space-y-3">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white font-black flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      <p className="text-slate-700 font-medium pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rate Recipe Interactive Area */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-black text-amber-950">Did you try this zero-waste recipe?</p>
                  <p className="text-amber-800 text-[11px]">Leave a rating to help other Indian home cooks rescue food.</p>
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => onRateRecipe(selectedRecipe.id, star)}
                      className="p-1 hover:scale-125 transition-transform text-amber-400 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= (selectedRecipe.userRating || Math.round(selectedRecipe.averageRating))
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  {selectedRecipe.userRating && (
                    <span className="text-[10px] font-bold text-emerald-800 ml-1">Rated ✓</span>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onCookRecipe) onCookRecipe(selectedRecipe);
                  setSelectedRecipe(null);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Cooked This! Rescued Waste</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SHARE RECIPE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden">
            
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-[#046A38] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl border border-white/20">
                  ✨
                </div>
                <div>
                  <h3 className="text-lg font-black">Share a Zero-Waste Indian Recipe</h3>
                  <p className="text-xs text-emerald-100 opacity-90">
                    Contribute your family hack to India&apos;s pantry rescue movement
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleShareSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recipe Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Tarbooz Chhilka Sabzi"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hindi / Regional Name</label>
                  <input
                    type="text"
                    value={newHindiName}
                    onChange={(e) => setNewHindiName(e.target.value)}
                    placeholder="e.g. तरबूज के छिलके की सब्जी"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    placeholder="e.g. Meera Patel"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={newAuthorLocation}
                    onChange={(e) => setNewAuthorLocation(e.target.value)}
                    placeholder="e.g. Surat, Gujarat"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dish Emoji Avatar</label>
                  <select
                    value={newImageEmoji}
                    onChange={(e) => setNewImageEmoji(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="🍲">🍲 Sabzi & Curry</option>
                    <option value="🫓">🫓 Roti & Paratha</option>
                    <option value="🍉">🍉 Fruit Rind Hack</option>
                    <option value="🥦">🥦 Stalks & Greens</option>
                    <option value="🍘">🍘 Cutlet / Pakoda</option>
                    <option value="🥣">🥣 Kadhi & Dal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Crunchy white watermelon rind cubes tossed in panch-phoran & roasted besan."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ingredients with Zero-Waste Origins (1 per line: Name - Origin) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newIngredientsText}
                  onChange={(e) => setNewIngredientsText(e.target.value)}
                  placeholder="Watermelon Rind (3 cups) - Fruit snack peels&#10;Besan (2 tbsp) - Masala dabba"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Step-by-Step Instructions (1 per line) *</label>
                <textarea
                  rows={4}
                  required
                  value={newInstructionsText}
                  onChange={(e) => setNewInstructionsText(e.target.value)}
                  placeholder="Step 1: Pare outer skin...&#10;Step 2: Heat oil and temper spices..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Zero-Waste Story / Grandmother Hack</label>
                <textarea
                  rows={2}
                  value={newZeroWasteStory}
                  onChange={(e) => setNewZeroWasteStory(e.target.value)}
                  placeholder="e.g. In Marwari households, we never throw away the white rind of watermelons. It absorbs masalas like ridge gourd!"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTagsText}
                  onChange={(e) => setNewTagsText(e.target.value)}
                  placeholder="#RotiRescue, #FruitRind, #VeganDesi"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md cursor-pointer"
                >
                  Publish Recipe
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
