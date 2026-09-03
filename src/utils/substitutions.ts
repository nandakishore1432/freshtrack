import { IngredientSubstitution, SubstitutionOption } from '../types';

export const INDIAN_SUBSTITUTIONS: IngredientSubstitution[] = [
  {
    targetIngredient: 'Fresh Coriander (Kothmir / Dhaniya Patta)',
    primaryFlavorProfile: 'Fresh Herbal Citrus & Cooling Aroma',
    alternatives: [
      {
        name: 'Fresh Mint (Pudina)',
        hindiName: 'पुदीना',
        ratio: '1:1 ratio (finely chopped)',
        flavorNote: 'Delivers a bright, zesty cooling herbal aroma that pairs naturally with chaats, dals, and biryanis.',
        flavorProfile: 'Bright, citrusy-menthol cooling freshness'
      },
      {
        name: 'Kasuri Methi (Dried Fenugreek)',
        hindiName: 'कसूरी मेथी',
        ratio: '1/2 tsp crushed between palms',
        flavorNote: 'Adds a warm, earthy, buttery aromatic restaurant-style finish to curries and dal tadka.',
        flavorProfile: 'Warm, earthy, savory roasted herb',
        isMasalaDabba: true
      },
      {
        name: 'Curry Leaves (Kadi Patta)',
        hindiName: 'कढ़ी पत्ता',
        ratio: '6-8 leaves tempered in hot oil',
        flavorNote: 'Lends an authentic South Indian and Maharashtrian aromatic citrus-herbaceous punch.',
        flavorProfile: 'Deep citrus-pine savory aroma'
      },
      {
        name: 'Finely chopped Celery Greens',
        hindiName: 'अजवाइन के पत्ते',
        ratio: '1:1 ratio',
        flavorNote: 'Provides crisp vegetal freshness and gentle herbal bitterness for garnishing sabzis.',
        flavorProfile: 'Clean, peppery herbal note'
      }
    ]
  },
  {
    targetIngredient: 'Tomato (Tamatar)',
    primaryFlavorProfile: 'Tangy Umami Acidity & Rich Gravy Body',
    alternatives: [
      {
        name: 'Amchur (Dry Mango Powder)',
        hindiName: 'अमचूर',
        ratio: '1/2 tsp per medium tomato',
        flavorNote: 'Instant tart, fruity sourness without making gravies too watery. Excellent for dry sabzis.',
        flavorProfile: 'Fruity, tangy, sharp acid',
        isMasalaDabba: true
      },
      {
        name: 'Dahi / Curd (Whisked Yogurt)',
        hindiName: 'ताजा या खट्टा दही',
        ratio: '2-3 tbsp whisked curd per tomato',
        flavorNote: 'Builds luxurious rich body and pleasant lactic sourness in paneer gravies and kormas.',
        flavorProfile: 'Creamy, lactic tartness & gravy body'
      },
      {
        name: 'Tamarind Paste (Imli)',
        hindiName: 'इमली का पल्प',
        ratio: '1 tsp diluted in warm water',
        flavorNote: 'Deep, earthy dark tanginess ideal for rasam, sambar, and spicy coastal curries.',
        flavorProfile: 'Deep, sweet-sour molasses tang'
      },
      {
        name: 'Fresh Lemon Juice',
        hindiName: 'नींबू का रस',
        ratio: '1 tbsp squeezed at the end',
        flavorNote: 'Clean, sharp citric lift right before serving dal or dry stir-fries.',
        flavorProfile: 'Bright, clean citric zing'
      }
    ]
  },
  {
    targetIngredient: 'Amul Fresh Paneer',
    primaryFlavorProfile: 'Mild Creamy Dairy Protein with Spongy Texture',
    alternatives: [
      {
        name: 'Firm Soy Tofu',
        hindiName: 'टोफू',
        ratio: '1:1 cube swap',
        flavorNote: 'Absorbs Desi masala gravies identically; 100% plant-based with high protein.',
        flavorProfile: 'Neutral canvas, sponges up spiced gravies'
      },
      {
        name: 'Boiled & Cubed Potatoes (Aloo)',
        hindiName: 'उबले आलू',
        ratio: '1:1 ratio (sautéed in haldi)',
        flavorNote: 'Classic Desi substitute (Aloo Palak instead of Palak Paneer); delicious comfort texture.',
        flavorProfile: 'Earthy, comforting carb companion'
      },
      {
        name: 'Boiled Kabuli Chana (Chickpeas)',
        hindiName: 'उबला काबुली चना',
        ratio: '1 cup boiled chickpeas',
        flavorNote: 'High-protein, hearty nutty bite that pairs gorgeously with rich spinach or onion-tomato gravies.',
        flavorProfile: 'Nutty, dense, protein-packed'
      },
      {
        name: 'Button Mushrooms',
        hindiName: 'मशरूम',
        ratio: '200g sliced mushrooms',
        flavorNote: 'Rich umami, juicy texture that simmers into curries just like paneer.',
        flavorProfile: 'Savory, juicy, earthy umami'
      }
    ]
  },
  {
    targetIngredient: 'Curd / Dahi (Yogurt)',
    primaryFlavorProfile: 'Lactic Sour Creaminess & Tenderizing Base',
    alternatives: [
      {
        name: 'Fresh Lemon Juice + Warm Milk',
        hindiName: 'दूध + नींबू (घर का छाछ)',
        ratio: '1 cup milk + 1 tbsp lemon juice (let sit 5 mins)',
        flavorNote: 'Instant buttermilk substitute that tenderizes marinades and adds smooth tartness.',
        flavorProfile: 'Light lactic sourness'
      },
      {
        name: 'Chaas (Buttermilk) reduced',
        hindiName: 'छाछ',
        ratio: '1:1 for liquid recipes like Kadhi',
        flavorNote: 'Ideal for tempering Kadhi, tempering thepla dough, or marinating vegetables.',
        flavorProfile: 'Refreshing light sour tang'
      },
      {
        name: 'Amchur (Dry Mango) + Water',
        hindiName: 'अमचूर + पानी घोल',
        ratio: '1 tsp amchur in 2 tbsp water',
        flavorNote: 'Gives the necessary sour kick when curd is unavailable for gravies.',
        flavorProfile: 'Tangy fruit acidity'
      }
    ]
  },
  {
    targetIngredient: 'Kasuri Methi (Dried Fenugreek Leaves)',
    primaryFlavorProfile: 'Warm, Earthy, Buttery Herbaceous Aroma',
    alternatives: [
      {
        name: 'Fresh Methi Leaves (lightly sautéed)',
        hindiName: 'ताजी मेथी',
        ratio: '2 tbsp finely chopped fresh leaves sautéed in ghee',
        flavorNote: 'True authentic fenugreek flavor with pleasant mild bitterness.',
        flavorProfile: 'Earthy, slightly bitter, deeply savory'
      },
      {
        name: 'Toasted Mustard Seeds (Rai)',
        hindiName: 'भुनी राई',
        ratio: '1/2 tsp popped in ghee/oil',
        flavorNote: 'Mimics the nutty, savory bitter undertones typical of North Indian restaurant gravies.',
        flavorProfile: 'Nutty, pungent, savory warmth',
        isMasalaDabba: true
      },
      {
        name: 'Celery leaves (crushed & dried)',
        hindiName: 'सूखे अजवाइन पत्ते',
        ratio: '1:1 ratio',
        flavorNote: 'Shares the aromatic herbal lactone notes of fenugreek.',
        flavorProfile: 'Herbaceous, aromatic finish'
      }
    ]
  },
  {
    targetIngredient: 'Fresh Ginger (Adrak)',
    primaryFlavorProfile: 'Pungent, Zesty Warmth & Digestive Zing',
    alternatives: [
      {
        name: 'Dry Ginger Powder (Sonth)',
        hindiName: 'सोंठ पाउडर',
        ratio: '1/4 tsp sonth per 1 inch fresh ginger',
        flavorNote: 'More concentrated, warm, sweet-spicy depth that dissolves smoothly into curries.',
        flavorProfile: 'Warm, intense, peppery sweet heat'
      },
      {
        name: 'Whole Peppercorn + Cloves crushed',
        hindiName: 'कुटी काली मिर्च और लौंग',
        ratio: '4 crushed peppercorns + 1 clove',
        flavorNote: 'Delivers the warming throat heat and aromatic spice punch in chai or gravies.',
        flavorProfile: 'Sharp, peppery warmth',
        isMasalaDabba: true
      }
    ]
  },
  {
    targetIngredient: 'Garam Masala',
    primaryFlavorProfile: 'Warm, Aromatic Finishing Spice Blend',
    alternatives: [
      {
        name: 'Kitchen King Masala',
        hindiName: 'किचन किंग मसाला',
        ratio: '1:1 ratio',
        flavorNote: 'Slightly more herbaceous with coriander notes, perfect for North Indian sabzis.',
        flavorProfile: 'Balanced all-in-one curry spice'
      },
      {
        name: 'Roasted Jeera + Dhaniya Powder + Black Pepper',
        hindiName: 'भुना जीरा-धनिया + काली मिर्च',
        ratio: '1/2 tsp jeera + 1/2 tsp dhaniya + 1/4 tsp pepper',
        flavorNote: 'Handmade Desi staple from your masala dabba with rich roasted aroma.',
        flavorProfile: 'Toasty, earthy, peppery warmth',
        isMasalaDabba: true
      }
    ]
  },
  {
    targetIngredient: 'Besan (Gram Flour)',
    primaryFlavorProfile: 'Nutty, Savory Thickener & Batter Base',
    alternatives: [
      {
        name: 'Roasted Chana Sattu',
        hindiName: 'सत्तू पाउडर',
        ratio: '1:1 ratio',
        flavorNote: 'Pre-roasted chickpea flour that dissolves smoothly without raw aftertaste.',
        flavorProfile: 'Deeply nutty, toasted chickpea flavor'
      },
      {
        name: 'Chakki Atta (Whole Wheat Flour)',
        hindiName: 'गेहूं का आटा',
        ratio: '1:1 ratio (sauté slightly in ghee first)',
        flavorNote: 'Excellent binder for pakoras and thickener for Kadhi or curries.',
        flavorProfile: 'Comforting toasted wheat flavor'
      },
      {
        name: 'Rice Flour (Chawal ka Atta)',
        hindiName: 'चावल का आटा',
        ratio: '3/4 cup per 1 cup besan',
        flavorNote: 'Makes coatings and pakoras exceptionally crispy and light.',
        flavorProfile: 'Neutral, ultra-crisp crunch'
      }
    ]
  },
  {
    targetIngredient: 'Fresh Cream / Malai',
    primaryFlavorProfile: 'Velvety Dairy Fat & Gravy Richness',
    alternatives: [
      {
        name: 'Cashew Paste (Kaju Paste)',
        hindiName: 'काजू का पेस्ट',
        ratio: '8-10 cashews soaked and blended with 2 tbsp warm water',
        flavorNote: 'Royal Shahi Mughlai body without curdling; natural sweetness and satin finish.',
        flavorProfile: 'Silky, rich, mildly sweet nuttiness'
      },
      {
        name: 'Full Cream Milk reduced with 1 tsp Atta/Ghee',
        hindiName: 'गाढ़ा दूध',
        ratio: '1/4 cup reduced milk',
        flavorNote: 'Smooth, accessible pantry solution that enriches tomato-onion makhani gravies.',
        flavorProfile: 'Rich, comforting dairy smoothness'
      },
      {
        name: 'Mashed Boiled Potato + 1 tsp Ghee',
        hindiName: 'मैश किया आलू',
        ratio: '1 tbsp smooth potato puree',
        flavorNote: 'Incredible zero-waste kitchen hack that emulsifies gravies to creamy restaurant thickness.',
        flavorProfile: 'Thick, creamy body with zero dairy'
      }
    ]
  },
  {
    targetIngredient: 'Onion / Garlic (Pyaaz / Lahsun)',
    primaryFlavorProfile: 'Sweet Allium Umami Base (Jain Substitutes)',
    alternatives: [
      {
        name: 'Hing (Asafoetida) in hot ghee/oil',
        hindiName: 'हींग का तड़का',
        ratio: '1/4 tsp bloomed in oil',
        flavorNote: 'Traditional Ayurvedic and Jain substitute replicating cooked allium savory aroma.',
        flavorProfile: 'Pungent, savory, allium-like umami',
        isMasalaDabba: true
      },
      {
        name: 'Finely Grated Cabbage + Ginger sautéed',
        hindiName: 'बारीक पत्तागोभी + अदरक',
        ratio: '1/2 cup grated cabbage per onion',
        flavorNote: 'Caramelizes with sweet, savory moisture just like browned onions.',
        flavorProfile: 'Sweet, caramelized vegetal base'
      }
    ]
  }
];

/**
 * Finds matching substitutions for a given missing ingredient string.
 * Checks against the user's active pantry and Masala Dabba spices to flag availability.
 */
export function getSubstitutionsForIngredient(
  missingIngredientName: string,
  pantryItemNames: string[],
  masalaDabbaActive: boolean = true
): SubstitutionOption[] {
  const query = missingIngredientName.toLowerCase().trim();

  // Find best matching category from INDIAN_SUBSTITUTIONS
  const match = INDIAN_SUBSTITUTIONS.find((entry) => {
    const target = entry.targetIngredient.toLowerCase();
    return (
      query.includes(target) ||
      target.includes(query) ||
      (query.includes('coriander') && target.includes('coriander')) ||
      (query.includes('kothmir') && target.includes('coriander')) ||
      (query.includes('tomato') && target.includes('tomato')) ||
      (query.includes('paneer') && target.includes('paneer')) ||
      (query.includes('curd') && target.includes('curd')) ||
      (query.includes('dahi') && target.includes('curd')) ||
      (query.includes('methi') && target.includes('methi')) ||
      (query.includes('ginger') && target.includes('ginger')) ||
      (query.includes('garam masala') && target.includes('garam masala')) ||
      (query.includes('besan') && target.includes('besan')) ||
      (query.includes('cream') && target.includes('cream')) ||
      (query.includes('malai') && target.includes('cream')) ||
      (query.includes('onion') && target.includes('onion')) ||
      (query.includes('garlic') && target.includes('garlic'))
    );
  });

  if (!match) {
    // Return generic intelligent Indian kitchen fallback
    return [
      {
        name: 'Pinch of Roasted Jeera & Turmeric from Masala Dabba',
        hindiName: 'जीरा व हल्दी',
        ratio: '1/2 tsp to balance flavor',
        flavorNote: 'Restores warmth and balanced savory aroma to the dish.',
        flavorProfile: 'Earthy golden warmth',
        isMasalaDabba: true,
        availableInPantry: masalaDabbaActive
      },
      {
        name: 'Squeeze of Fresh Lemon Juice (Nimbu)',
        hindiName: 'नींबू का रस',
        ratio: '1/2 lemon squeezed at finish',
        flavorNote: 'Elevates muted flavors and adds a lively, palate-cleansing zing.',
        flavorProfile: 'Bright, citric acidity',
        availableInPantry: pantryItemNames.some((n) => n.toLowerCase().includes('lemon') || n.toLowerCase().includes('nimbu'))
      }
    ];
  }

  // Map alternatives and enrich with real pantry availability
  return match.alternatives.map((alt) => {
    const altNameLower = alt.name.toLowerCase();
    const isAvailableInPantry = pantryItemNames.some((pName) => {
      const pLower = pName.toLowerCase();
      return (
        altNameLower.includes(pLower) ||
        pLower.includes(altNameLower.split(' ')[0]) ||
        (altNameLower.includes('curd') && pLower.includes('dahi')) ||
        (altNameLower.includes('tofu') && pLower.includes('tofu')) ||
        (altNameLower.includes('mint') && (pLower.includes('mint') || pLower.includes('pudina'))) ||
        (altNameLower.includes('potato') && (pLower.includes('aloo') || pLower.includes('potato'))) ||
        (altNameLower.includes('atta') && (pLower.includes('atta') || pLower.includes('wheat'))) ||
        (altNameLower.includes('milk') && (pLower.includes('milk') || pLower.includes('doodh')))
      );
    });

    const isMasalaDabbaMatch = alt.isMasalaDabba && masalaDabbaActive;

    return {
      ...alt,
      availableInPantry: isAvailableInPantry || isMasalaDabbaMatch
    };
  });
}

/**
 * Higher-level helper for recipes that returns the primary flavor role
 * and substitutions formatted with availability flags.
 */
export function findSubstitutionsForMissingIngredient(
  missingIngredientName: string,
  pantryItems: { name: string }[],
  masalaDabbaActive: boolean = true
) {
  const pantryNames = pantryItems.map((p) => p.name);
  const options = getSubstitutionsForIngredient(missingIngredientName, pantryNames, masalaDabbaActive);
  
  const query = missingIngredientName.toLowerCase().trim();
  const matchedEntry = INDIAN_SUBSTITUTIONS.find((entry) => {
    const target = entry.targetIngredient.toLowerCase();
    return (
      query.includes(target) ||
      target.includes(query) ||
      (query.includes('coriander') && target.includes('coriander')) ||
      (query.includes('kothmir') && target.includes('coriander')) ||
      (query.includes('tomato') && target.includes('tomato')) ||
      (query.includes('paneer') && target.includes('paneer'))
    );
  });

  return {
    flavorRole: matchedEntry?.primaryFlavorProfile || 'Fresh Indian Flavor & Balanced Aromatics',
    substitutions: options.map((opt) => ({
      name: opt.name,
      hindiName: opt.hindiName,
      flavorNote: opt.flavorNote,
      usageRatio: opt.ratio,
      isAvailableInPantry: Boolean(opt.availableInPantry),
      isInMasalaDabba: Boolean(opt.isMasalaDabba && masalaDabbaActive)
    }))
  };
}
