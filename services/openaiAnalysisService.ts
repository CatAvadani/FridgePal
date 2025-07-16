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

    const prompt = `
          You are a smart fridge assistant.

          Here is the list of categories you must use:
            [
              { "categoryId": 1, "categoryName": "dairy" },
              { "categoryId": 2, "categoryName": "meat" },
              { "categoryId": 3, "categoryName": "vegetables" },
              { "categoryId": 4, "categoryName": "fruits" },
              { "categoryId": 5, "categoryName": "fish" },
              { "categoryId": 6, "categoryName": "beverages" },
              { "categoryId": 7, "categoryName": "frozen" },
              { "categoryId": 8, "categoryName": "other" }
         ]

          Estimate for the image:
          - productName: the most likely food name (string)
          - categoryId: integer from the list above
          - categoryName: string from the list above (exact match)
          - quantity: integer, estimated visible items
          - shelfLifeDays: integer, days the item typically lasts in a fridge for that category

          Respond ONLY with valid pure JSON in this format:
       {
         "productName": "...",
         "categoryId": ...,
         "categoryName": "...",
         "quantity": ...,
         "shelfLifeDays": ...
    }
         No markdown or explanation, just JSON.
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
          max_tokens: 300,
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

    // Use fallback if missing values
    const categoryName =
      aiResult.categoryName && typeof aiResult.categoryName === 'string'
        ? aiResult.categoryName.toLowerCase()
        : 'other';
    const shelfLife =
      aiResult.shelfLifeDays || getDefaultShelfLife(categoryName);
    const categoryId =
      aiResult.categoryId && typeof aiResult.categoryId === 'number'
        ? aiResult.categoryId
        : getCategoryId(categoryName);

    const result: AIAnalysisResult = {
      productName: aiResult.productName || 'Unknown Product',
      categoryName,
      categoryId,
      quantity:
        typeof aiResult.quantity === 'number' && aiResult.quantity > 0
          ? aiResult.quantity
          : 1,
      expirationDate: calculateExpirationDate(shelfLife),
      confidence: 0.9,
    };

    return result;
  } catch (error) {
    console.error('OpenAI Analysis error:', error);
    throw error;
  }
};
