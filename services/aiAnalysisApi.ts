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

// Helper function to calculate expiration date from shelf life
const calculateExpirationDate = (shelfLife: string): string => {
  const today = new Date();
  let daysToAdd = 7;

  // Parse shelf life string like "5-7 days"
  const match = shelfLife.match(/(\d+)(?:-(\d+))?\s*days?/i);
  if (match) {
    const minDays = parseInt(match[1]);
    const maxDays = match[2] ? parseInt(match[2]) : minDays;
    daysToAdd = Math.ceil((minDays + maxDays) / 2);
  }

  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + daysToAdd);

  return expirationDate.toISOString();
};

export const analyzeImageWithAI = async (
  imageUri: string
): Promise<AIAnalysisResult> => {
  try {
    console.log('🔬 Starting AI analysis for image:', imageUri);

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

    const result: AIAnalysisResult = {
      productName: backendResult.itemName,
      categoryName: backendResult.category,
      categoryId: getCategoryIdByName(backendResult.category),
      expirationDate: calculateExpirationDate(backendResult.shelfLife),
      quantity: 1,
      confidence: 0.9,
    };

    console.log('✨ Transformed AI Analysis result:', result);
    return result;
  } catch (error) {
    console.error('💥 AI Analysis error:', error);
    throw new Error('Failed to analyze image with AI');
  }
};

// Mock function for testing - returns realistic data
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
