import { AIAnalysisResult } from '@/types/interfaces';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

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
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

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

    console.log('🤖 Calling OpenAI API...');

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
                {
                  type: 'text',
                  text: `Analyze this food product image and return ONLY a JSON object with these exact fields:
                {
                  "productName": "name of the food item",
                  "categoryName": "dairy, meat, vegetables, fruits, fish, beverages, frozen, or other",
                  "quantity": 1,
                  "shelfLifeDays": 7
                }
                
                No additional text, just the JSON object.`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64,
                    detail: 'low',
                  },
                },
              ],
            },
          ],
          max_tokens: 150,
          temperature: 0.1,
        }),
      }
    );

    console.log('OpenAI Response Status:', openAIResponse.status);

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI Error Response:', errorText);
      throw new Error(
        `OpenAI API error: ${openAIResponse.status} - ${errorText}`
      );
    }

    const data = await openAIResponse.json();
    console.log(' OpenAI Response:', data);

    const content = data.choices[0]?.message?.content;
    console.log(' Raw content from OpenAI:', content);

    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Clean the content before parsing
    const cleanContent = content
      .trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '');
    console.log(' Cleaned content:', cleanContent);

    // Parse the JSON response
    let aiResult;
    try {
      aiResult = JSON.parse(cleanContent);
      console.log(' Parsed AI Result:', aiResult);
    } catch (parseError) {
      console.error(' JSON Parse Error:', parseError);
      console.error(' Content that failed to parse:', cleanContent);

      // Fallback: try to extract JSON from the response
      const jsonMatch = cleanContent.match(/\{[^}]*\}/);
      if (jsonMatch) {
        console.log(' Trying fallback JSON extraction:', jsonMatch[0]);
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`Could not parse OpenAI response: ${cleanContent}`);
      }
    }

    const result: AIAnalysisResult = {
      productName: aiResult.productName || 'Unknown Product',
      categoryName: aiResult.categoryName || 'other',
      categoryId: getCategoryId(aiResult.categoryName || 'other'),
      quantity: aiResult.quantity || 1,
      expirationDate: calculateExpirationDate(aiResult.shelfLifeDays || 7),
      confidence: 0.9,
    };

    return result;
  } catch (error) {
    console.error(' OpenAI Analysis error:', error);
    throw error;
  }
};
