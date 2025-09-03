import { AIAnalysisResult } from '@/types/interfaces';
import { formatProductName } from '@/utils/formatProductName';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';

// Fallback: Return shelf life in days by category
const getDefaultShelfLife = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'dairy':
      return 7;
    case 'meat':
      return 4;
    case 'vegetables':
      return 5;
    case 'fruits':
      return 7;
    case 'fish':
      return 2;
    case 'beverages':
      return 30;
    case 'frozen':
      return 90;
    default:
      return 7;
  }
};

const getCategoryId = (categoryName: string): number => {
  const categories: { [key: string]: number } = {
    dairy: 1,
    meat: 2,
    vegetables: 3,
    fruits: 4,
    fish: 5,
    beverages: 6,
    frozen: 7,
    other: 8,
  };
  const lowerCaseName = categoryName.toLowerCase();
  return categories[lowerCaseName] || 8;
};

const calculateExpirationDate = (days: number): string => {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + days);
  return expirationDate.toISOString();
};

export const analyzeImageWithAI = async (
  imageUri: string
): Promise<AIAnalysisResult> => {
  try {
    if (!OPENAI_API_KEY) throw new Error('OpenAI API key not configured');

    // Convert image to base64 for React Native
    const response = await fetch(imageUri);
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      response.blob().then((blob) => reader.readAsDataURL(blob));
    });

    // IMPROVED PROMPT FOR BETTER ACCURACY
    const prompt = `
You are an expert food identification assistant. Analyze this image carefully and provide accurate information.

CATEGORIES (use exact categoryName):
- { "categoryId": 1, "categoryName": "dairy" } - milk, cheese, yogurt, butter
- { "categoryId": 2, "categoryName": "meat" } - beef, chicken, pork, lamb, deli meats
- { "categoryId": 3, "categoryName": "vegetables" } - all vegetables, herbs, salads
- { "categoryId": 4, "categoryName": "fruits" } - all fruits, berries
- { "categoryId": 5, "categoryName": "fish" } - fish, seafood, shellfish
- { "categoryId": 6, "categoryName": "beverages" } - drinks, juices, sodas
- { "categoryId": 7, "categoryName": "frozen" } - frozen foods of any type
- { "categoryId": 8, "categoryName": "other" } - everything else

COUNTING INSTRUCTIONS:
- Count ONLY individual items that are clearly visible and separate
- For packaged items: count packages (e.g., 1 milk carton = 1, not individual servings)
- For bunched items: count logical units (e.g., 1 bunch of bananas = quantity based on visible bananas)
- For unclear quantities: estimate conservatively (default to 1 if uncertain)
- Focus on items that look like they need individual expiration tracking

SHELF LIFE GUIDELINES (days from purchase):
- Dairy: 5-14 days (milk 7, hard cheese 14, soft cheese 5)
- Meat: 2-5 days (ground meat 2, steaks 3-5)
- Vegetables: 3-14 days (leafy greens 3-5, root vegetables 7-14)
- Fruits: 3-14 days (berries 3-5, apples 7-14, bananas 5-7)
- Fish: 1-3 days (fresh fish 1-2, shellfish 1-3)
- Beverages: 7-365 days (fresh juice 7, sodas 365)
- Frozen: 30-365 days depending on item type

RESPONSE FORMAT - Return ONLY valid JSON:
{
  "productName": "specific food name (e.g., 'Red Bell Peppers', 'Whole Milk')",
  "categoryId": number,
  "categoryName": "exact category from list",
  "quantity": number,
  "shelfLifeDays": number
}

Analyze the image step by step:
1. Identify the main food item(s)
2. Count visible individual items carefully
3. Determine the most specific category
4. Estimate realistic shelf life for that specific item type
`.trim();

    const openAIResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          // model: 'gpt-4o', // use full model for accuracy
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64,
                    detail: 'high', // Changed from 'low' to 'high' for better accuracy
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
          temperature: 0.0, // Changed from 0.1 to 0.0 for more consistent results
        }),
      }
    );

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      throw new Error(
        `OpenAI API error: ${openAIResponse.status} - ${errorText}`
      );
    }

    const data = await openAIResponse.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content in OpenAI response');

    // Clean the content before parsing
    const cleanContent = content
      .trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '');

    let aiResult: any;
    try {
      aiResult = JSON.parse(cleanContent);
    } catch {
      const jsonMatch = cleanContent.match(/\{[^}]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`Could not parse OpenAI response: ${cleanContent}`);
      }
    }

    // Validate and sanitize the results
    const categoryName =
      aiResult.categoryName && typeof aiResult.categoryName === 'string'
        ? aiResult.categoryName.toLowerCase()
        : 'other';

    // Improved shelf life logic with more specific defaults
    let shelfLife = aiResult.shelfLifeDays;
    if (!shelfLife || typeof shelfLife !== 'number' || shelfLife <= 0) {
      shelfLife = getDefaultShelfLife(categoryName);
    }

    // Validate quantity - ensure it's reasonable
    let quantity = aiResult.quantity;
    if (
      !quantity ||
      typeof quantity !== 'number' ||
      quantity <= 0 ||
      quantity > 50
    ) {
      quantity = 1; // Default to 1 for unreasonable quantities
    }

    const categoryId =
      aiResult.categoryId && typeof aiResult.categoryId === 'number'
        ? aiResult.categoryId
        : getCategoryId(categoryName);

    const result: AIAnalysisResult = {
      productName: formatProductName(aiResult.productName || 'Unknown Product'),
      categoryName,
      categoryId,
      quantity: Math.round(quantity),
      expirationDate: calculateExpirationDate(shelfLife),
      confidence: 0.9,
    };

    return result;
  } catch (error) {
    console.log('AI Analysis error:', error);
    throw error;
  }
};
