import { AIAnalysisResult } from '@/types/interfaces';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

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

const calculateExpirationDate = (days: number): string => {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + days);
  return expirationDate.toISOString();
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

export const analyzeImageWithAI = async (
  imageUri: string
): Promise<AIAnalysisResult> => {
  try {
    if (!OPENAI_API_KEY) throw new Error('OpenAI API key not configured');

    // Convert image to base64 for React Native
    const response = await fetch(imageUri);

    // Use FileReader for React Native compatibility
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      response.blob().then((blob) => reader.readAsDataURL(blob));
    });

    const prompt = `
      Analyze this food product image and return ONLY a JSON object with these exact fields:
      {
        "productName": "name of the food item",
        "categoryName": "dairy, meat, vegetables, fruits, fish, beverages, frozen, or other",
        "quantity": [Estimate how many items you see in the image. If unclear, return 1.],
        "shelfLifeDays": [Estimate shelf life based on category: dairy 7, meat 4, vegetables 5, fruits 7, fish 2, beverages 30, frozen 90, other 7]
      }
      No additional text, just the JSON object.
    `;

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
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: { url: base64, detail: 'low' },
                },
              ],
            },
          ],
          max_tokens: 150,
          temperature: 0.1,
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
    const content = data.choices[0]?.message?.content;
    if (!content) throw new Error('No content in OpenAI response');

    // Clean the content before parsing
    const cleanContent = content
      .trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '');

    // Parse the JSON response
    let aiResult;
    try {
      aiResult = JSON.parse(cleanContent);
    } catch (parseError) {
      // Fallback: try to extract JSON from the response
      const jsonMatch = cleanContent.match(/\{[^}]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`Could not parse OpenAI response: ${cleanContent}`);
      }
    }

    const categoryName = aiResult.categoryName || 'other';
    const shelfLife =
      aiResult.shelfLifeDays || getDefaultShelfLife(categoryName);

    const result: AIAnalysisResult = {
      productName: aiResult.productName || 'Unknown Product',
      categoryName,
      categoryId: getCategoryId(categoryName),
      quantity: aiResult.quantity || 1,
      expirationDate: calculateExpirationDate(shelfLife),
      confidence: 0.9,
    };

    return result;
  } catch (error) {
    console.error('OpenAI Analysis error:', error);
    throw error;
  }
};
