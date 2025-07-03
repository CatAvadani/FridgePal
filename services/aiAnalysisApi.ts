import { AIAnalysisResult, BackendAIResponse } from '@/types/interfaces';
import { apiCall, ENDPOINTS } from './apiClient';

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
    const formData = new FormData();
    formData.append('Image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `analysis-${Date.now()}.jpg`,
    } as any);

    const backendResult: BackendAIResponse = await apiCall(
      ENDPOINTS.AI_ANALYSIS,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result: AIAnalysisResult = {
      productName: backendResult.itemName,
      categoryName: backendResult.categoryName,
      categoryId: backendResult.categoryId,
      quantity: backendResult.quantity,
      expirationDate: calculateExpirationDate(backendResult.shelfLifeDays),
      confidence: 0.9,
    };

    return result;
  } catch (error) {
    console.error('AI Analysis error:', error);
    throw new Error('Failed to analyze image with AI');
  }
};

export const mockAnalyzeImageWithAI = async (
  imageUri: string
): Promise<AIAnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        productName: 'apple',
        categoryId: 4,
        categoryName: 'Fruits',
        quantity: 4,
        expirationDate: calculateExpirationDate(30),
        confidence: 0.92,
      });
    }, 2000);
  });
};
