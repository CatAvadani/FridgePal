import type { AIAnalysisResult } from '@/types/interfaces';
import { supabase } from './supabase';

export const analyzeImageWithAI = async (
  imageUri: string
): Promise<AIAnalysisResult> => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `analysis-${Date.now()}.jpg`,
  } as any);

  const { data, error } = await supabase.functions.invoke('analyze-image', {
    body: formData, // SDK sets Authorization + multipart boundary
  });

  if (error)
    throw new Error(`Edge function error: ${error.status} - ${error.message}`);
  return data as AIAnalysisResult;
};
