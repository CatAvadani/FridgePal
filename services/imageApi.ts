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
    console.log('Starting image upload to Cloudinary...');
    console.log('Image data:', {
      uri: imageData.uri.substring(0, 50) + '...',
      type: imageData.type,
      name: imageData.name,
    });

    const formData = new FormData();
    formData.append('file', {
      uri: imageData.uri,
      type: imageData.type,
      name: imageData.name,
    } as any);

    console.log(' Sending request to:', ENDPOINTS.CLOUDINARY_UPLOAD);

    const response: ImageUploadResponse = await apiCall(
      ENDPOINTS.CLOUDINARY_UPLOAD,
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log('Upload successful! Response:', response);
    console.log('Cloudinary URL:', response.url);

    return response.url;
  } catch (error) {
    console.error(' Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};
