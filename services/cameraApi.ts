export interface MockPhoto {
  uri: string;
  base64?: string;
}

export interface MockBackendResponse {
  productName: string;
  expirationDate: string;
  quantity: number;
  categoryId: number;
  categoryName: string;
  photoUri: string;
}

export const mockSendToBackend = async (
  photo: MockPhoto
): Promise<MockBackendResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        productName: 'Mock Product',
        expirationDate: '2025-06-29',
        quantity: 1,
        categoryId: 1,
        categoryName: 'Dairy',
        photoUri: photo.uri,
      });
    }, 1000);
  });
};
