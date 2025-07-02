import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export interface ImagePickerResult {
  uri: string;
  type: string;
  name: string;
}

export const requestImagePermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Sorry, we need camera roll permissions to upload images.'
    );
    return false;
  }
  return true;
};

export const pickImage = async (): Promise<ImagePickerResult | null> => {
  const hasPermission = await requestImagePermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    base64: false,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    return {
      uri: asset.uri,
      type: 'image/jpeg',
      name: `product-${Date.now()}.jpg`,
    };
  }

  return null;
};

export const takePhoto = async (): Promise<ImagePickerResult | null> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Sorry, we need camera permissions to take photos.'
    );
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    return {
      uri: asset.uri,
      type: 'image/jpeg',
      name: `product-${Date.now()}.jpg`,
    };
  }

  return null;
};
