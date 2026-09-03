import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  const hasGemini = Boolean(getGeminiClient());
  res.json({ status: "ok", aiAvailable: hasGemini });
});

// API: OCR / Receipt Parsing using Gemini with smart fallback
app.post("/api/ocr-receipt", async (req, res) => {
  try {
    const { receiptText, receiptType, imageBase64 } = req.body;
    const client = getGeminiClient();

    if (client && (receiptText || imageBase64)) {
      try {
        const prompt = `You are FreshTrack AI's Indian Grocery OCR parser.
Given this receipt input (DMart, Reliance Fresh, Blinkit, Zepto, or Kirana store bill), extract every grocery item into structured JSON.
Standardize typical Indian receipt abbreviations (e.g. 'PALAK PKT' -> 'Palak / Spinach', '1KG TAZA MILK' -> 'Taza Fresh Milk', 'AMUL PANEER 200G' -> 'Fresh Paneer', 'AASHIRVAAD ATTA 5KG' -> 'Chakki Atta (Wheat Flour)').

Assign realistic shelf-life in days based on standard Indian kitchen room/refrigerator storage:
- Fresh Leafy Greens (Palak, Methi, Coriander): 1-2 days
- Fresh Dairy (Milk, Paneer, Dahi): 2-3 days
- Vegetables (Tomatoes, Cauliflower, Capsicum): 4-7 days
- Root Vegetables (Potatoes, Onions): 14-21 days
- Dry Staples (Atta, Dal, Rice, Spices, Oil): 60-180 days

Return STRICT JSON matching this schema:
{
  "items": [
    {
      "rawText": "original text from receipt",
      "name": "Standardized Indian item name",
      "category": "dairy" | "vegetables" | "staples" | "spices" | "snacks" | "other",
      "quantity": "e.g. 500g, 1 kg, 1 pkt, 200g",
      "estimatedDaysLeft": number,
      "price": number
    }
  ]
}

Receipt data:
${receiptText || "Processed receipt image payload"}`;

        const contents: any[] = [];
        if (imageBase64) {
          const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
          contents.push({
            inlineData: {
              data: cleanBase64,
              mimeType: "image/jpeg"
            }
          });
        }
        contents.push(prompt);

        const response = await client.models.generateContent({
          model: "gemini-3.8-flash",
          contents: contents
        });

        const textOutput = response.text || "";
        const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({ success: true, items: parsed.items, source: "gemini" });
        }
      } catch (geminiError) {
        console.warn("Gemini OCR parsing fallback triggered:", geminiError);
      }
    }

    // Parser for receipt lines or pasted slips
    let itemsToReturn: any[] = [];
    if (receiptText && receiptText.trim().length > 0) {
      const lines = receiptText.split("\n").map((l: string) => l.trim()).filter(Boolean);
      const parsedFromLines = lines.map((line: string) => {
        const lower = line.toLowerCase();
        let cat = "other";
        let days = 5;
        let name = line;
        let qty = "1 unit";

        // Try extracting price from line (e.g., "54.00", "₹54", "- 54")
        const priceMatch = line.match(/(?:₹|\bRs\.?|\bINR|\b-|\b\s)\s*(\d+(?:\.\d{1,2})?)\s*$/i) ||
                           line.match(/(\d+(?:\.\d{1,2})?)\s*$/);
        const parsedPrice = priceMatch ? Math.round(parseFloat(priceMatch[1])) : 0;

        if (lower.includes("milk") || lower.includes("doodh") || lower.includes("taza")) {
          cat = "dairy"; days = 1; name = "Fresh Milk"; qty = "1 Litre";
        } else if (lower.includes("palak") || lower.includes("spinach") || lower.includes("methi") || lower.includes("kothmir") || lower.includes("coriander")) {
          cat = "vegetables"; days = 1; name = line.includes("palak") ? "Palak (Spinach)" : "Fresh Green Herb"; qty = "1 bunch";
        } else if (lower.includes("paneer")) {
          cat = "dairy"; days = 2; name = "Fresh Paneer"; qty = "200g";
        } else if (lower.includes("dahi") || lower.includes("curd")) {
          cat = "dairy"; days = 2; name = "Dahi / Curd"; qty = "400g";
        } else if (lower.includes("atta") || lower.includes("flour")) {
          cat = "staples"; days = 60; name = "Wheat Flour (Atta)"; qty = "5 kg";
        } else if (lower.includes("dal") || lower.includes("pulses")) {
          cat = "staples"; days = 90; name = "Toor Dal (Pantry Staple)"; qty = "1 kg";
        } else if (lower.includes("oil") || lower.includes("tel")) {
          cat = "staples"; days = 180; name = "Cooking Oil"; qty = "1 Litre";
        } else if (lower.includes("tomato") || lower.includes("tamatar")) {
          cat = "vegetables"; days = 4; name = "Ripe Tomatoes"; qty = "500g";
        }

        return {
          rawText: line,
          name,
          category: cat,
          quantity: qty,
          estimatedDaysLeft: days,
          price: parsedPrice > 0 ? parsedPrice : 0
        };
      });

      if (parsedFromLines.length > 0) {
        itemsToReturn = parsedFromLines;
      }
    }

    return res.json({
      success: true,
      items: itemsToReturn,
      source: "rule-based"
    });
  } catch (error: any) {
    console.error("Receipt parsing error:", error);
    res.status(500).json({ error: "Failed to parse receipt", details: error.message });
  }
});

// API: AI Zero-Waste Recipe Generator
app.post("/api/ai-recipe", async (req, res) => {
  try {
    const { expiringItems, pantryItems, masalaDabbaAvailable, mealType } = req.body;
    const client = getGeminiClient();

    if (client) {
      try {
        const prompt = `You are a legendary Indian home chef specializing in zero-waste cooking for Indian households.
The user has these ingredients expiring within 48 hours: ${JSON.stringify(expiringItems)}.
Other available pantry ingredients: ${JSON.stringify(pantryItems || [])}.
Masala Dabba available: ${masalaDabbaAvailable ? "YES (Haldi, Jeera, Mustard seeds, Lal Mirch, Dhaniya powder, Garam Masala, Salt, Oil/Ghee)" : "NO"}.
Meal preference: ${mealType || "Any traditional Indian dish"}.

Create an authentic, practical, delicious Indian recipe that rescues the expiring ingredients.
Return STRICT JSON:
{
  "title": "Dish Name (e.g. Zero-Waste Palak Paneer Bhurji)",
  "hindiName": "पालक पनीर भुर्जी",
  "prepTime": "15 mins",
  "cookTime": "15 mins",
  "servings": "2-3",
  "usesExpiringPercent": 100,
  "missingIngredientsCount": 0,
  "tags": ["Uses 100% Expiring Items", "Prep Time: 20 Mins", "Comfort Food"],
  "rupeeSaved": 140,
  "pantryIngredients": ["Fresh Palak", "Amul Paneer"],
  "masalaDabbaSpices": ["Jeera", "Haldi", "Lal Mirch", "Mustard Oil"],
  "missingIngredients": [],
  "instructions": [
    "Wash palak leaves thoroughly, blanch in hot water for 2 mins, then refresh in cold water and chop finely.",
    "Heat 1 tbsp mustard oil or ghee in a kadai until smoking. Lower flame and add 1/2 tsp jeera.",
    "Add chopped onions/ginger, sauté until golden, then add haldi, deggi mirch, and chopped palak.",
    "Crumble fresh paneer directly into the kadai and stir gently on medium flame for 3-4 minutes.",
    "Finish with a pinch of garam masala and fresh coriander. Serve hot with rotis or parathas."
  ],
  "chefTip": "Blanching green leafy veggies like palak in hot water before adding stops enzymatic breakdown and revives wilted leaves instantly!"
}`;

        const response = await client.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const recipe = JSON.parse(jsonMatch[0]);
          return res.json({ success: true, recipe, source: "gemini" });
        }
      } catch (err) {
        console.warn("Gemini recipe generator fallback:", err);
      }
    }

    // Dynamic fallback recipe using actual user pantry ingredients
    const userIngredients = [
      ...(Array.isArray(expiringItems) ? expiringItems : []),
      ...(Array.isArray(pantryItems) ? pantryItems : [])
    ].filter(Boolean);

    if (userIngredients.length === 0) {
      return res.json({
        success: false,
        error: "Your pantry is currently empty. Add items or scan a receipt first to generate zero-waste recipes!"
      });
    }

    const primaryItem = String(userIngredients[0]).replace(/\(.*\)/g, '').trim();
    const secondaryItem = userIngredients.length > 1 ? String(userIngredients[1]).replace(/\(.*\)/g, '').trim() : '';
    const title = secondaryItem 
      ? `Zero-Waste ${primaryItem} & ${secondaryItem} Stir-Fry`
      : `Zero-Waste Homestyle ${primaryItem} Sabzi`;
    const hindiName = `${primaryItem} की सूखी सब्जी`;

    res.json({
      success: true,
      recipe: {
        title,
        hindiName,
        prepTime: "10 mins",
        cookTime: "15 mins",
        servings: "2",
        usesExpiringPercent: 100,
        missingIngredientsCount: 0,
        tags: ["Uses Pantry Items", "Quick 20-Min Prep", "Zero Waste"],
        rupeeSaved: 80,
        pantryIngredients: userIngredients.slice(0, 3),
        masalaDabbaSpices: ["Jeera", "Haldi", "Mustard Seeds", "Lal Mirch", "Salt", "Cooking Oil"],
        missingIngredients: [],
        instructions: [
          `Thoroughly wash and prep the ${primaryItem}${secondaryItem ? ` and ${secondaryItem}` : ''}.`,
          "Heat 1 tbsp cooking oil or ghee in a pan on medium flame. Add 1/2 tsp jeera and let it crackle.",
          `Add ${primaryItem}${secondaryItem ? ` and ${secondaryItem}` : ''} to the pan. Add 1/2 tsp turmeric, 1/2 tsp red chilli powder, and salt to taste.`,
          "Sauté on medium flame, covering with a lid for 5-7 minutes until tender.",
          "Garnish with a pinch of garam masala or fresh lemon juice and serve hot with rotis or rice."
        ],
        chefTip: "Cook on low-to-medium heat to preserve moisture and flavor without scorching dry spices."
      },
      source: "rule-based"
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate recipe", details: error.message });
  }
});

// Production and Development Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FreshTrack AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
