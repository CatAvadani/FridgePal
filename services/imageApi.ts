import { apiCall, ENDPOINTS } from './apiClient';

export interface ImageUploadResponse {
  message: string;
  url: string;
}

export const uploadImageToCloudinary = async (imageData: {
  uri: string;
  type: string;
  name: string;
}): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageData.uri,
      type: imageData.type,
      name: imageData.name,
    } as any);

    const response: ImageUploadResponse = await apiCall(
      ENDPOINTS.CLOUDINARY_UPLOAD,
      {
        method: 'POST',
        body: formData,
      }
    );

    return response.url;
  } catch (error) {
    console.error(' Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};
