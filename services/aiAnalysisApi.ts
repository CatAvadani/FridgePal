import { CATEGORIES } from '@/types/interfaces';
import { apiCall, ENDPOINTS } from './apiClient';

export interface BackendAIResponse {
  itemName: string;
  category: string;
  shelfLife: string;
}

export interface AIAnalysisResult {
  productName: string;
  expirationDate: string;
  quantity: number;
  categoryId: number;
  categoryName: string;
  confidence: number;
}

const getCategoryIdByName = (categoryName: string): number => {
  const category = CATEGORIES.find(
    (cat) => cat.categoryName.toLowerCase() === categoryName.toLowerCase()
  );
  return category ? category.categoryId : 1;
};

export const analyzeImageWithAI = async (
  imageUri: string
): Promise<AIAnalysisResult> => {
  try {
    console.log('Starting AI analysis for image:', imageUri);

    const formData = new FormData();
    formData.append('Image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `analysis-${Date.now()}.jpg`,
    } as any);

    console.log('Sending request to:', ENDPOINTS.AI_ANALYSIS);

    const backendResult: BackendAIResponse = await apiCall(
      ENDPOINTS.AI_ANALYSIS,
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log('Backend AI Analysis result:', backendResult);

    console.log(
      'Available categories:',
      CATEGORIES.map((cat) => ({ id: cat.categoryId, name: cat.categoryName }))
    );
    console.log('Looking for category:', backendResult.category);

    let categoryId = 8;

    // Handle the specific case: "fruit" -> "Fruits" (ID 4)
    if (backendResult.category.toLowerCase() === 'fruit') {
      categoryId = 4; // Fruits
      console.log('Mapped fruit to Fruits (ID 4)');
    } else {
      const normalizedName = backendResult.category.toLowerCase();
      const category = CATEGORIES.find((cat) => {
        const catName = cat.categoryName.toLowerCase();
        return (
          catName === normalizedName ||
          catName === normalizedName + 's' ||
          normalizedName === catName + 's' ||
          catName.includes(normalizedName) ||
          normalizedName.includes(catName)
        );
      });

      if (category) {
        categoryId = category.categoryId;
        console.log(
          'General mapping found:',
          backendResult.category,
          '->',
          category.categoryName,
          'ID:',
          categoryId
        );
      }
    }

    const categoryName =
      CATEGORIES.find((cat) => cat.categoryId === categoryId)?.categoryName ||
      'Other';
    console.log(
      'Final category result - ID:',
      categoryId,
      'Name:',
      categoryName
    );

    console.log(
      'Calculating expiration for shelf life:',
      backendResult.shelfLife
    );
    const today = new Date();
    let daysToAdd = 10;

    if (backendResult.shelfLife) {
      // Handle number format like "4"
      const numberMatch = backendResult.shelfLife.match(/^\d+$/);
      if (numberMatch) {
        daysToAdd = parseInt(backendResult.shelfLife);
        console.log('Found number format, days to add:', daysToAdd);
      }
    }

    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + daysToAdd);
    console.log(
      'Expiration calculation - Today:',
      today.toDateString(),
      'Adding:',
      daysToAdd,
      'days, Result:',
      expirationDate.toDateString()
    );

    const result: AIAnalysisResult = {
      productName: backendResult.itemName,
      categoryName: categoryName,
      categoryId: categoryId,
      expirationDate: expirationDate.toISOString(),
      quantity: 1,
      confidence: 0.9,
    };

    console.log('Final transformed result:', result);
    return result;
  } catch (error) {
    console.error('AI Analysis error:', error);
    throw new Error('Failed to analyze image with AI');
  }
};

// Mock function for testing
export const mockAnalyzeImageWithAI = async (
  imageUri: string
): Promise<AIAnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate expiration date (7 days from now for testing)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      resolve({
        productName: 'Banana',
        expirationDate: expirationDate.toISOString(),
        quantity: 2,
        categoryId: getCategoryIdByName('Fruits'),
        categoryName: 'Fruits',
        confidence: 0.92,
      });
    }, 2000);
  });
};
