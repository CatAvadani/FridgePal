import { Platform } from 'react-native';

export const headerClassName = `flex-row items-center justify-between pb-3 ${
  Platform.OS === 'android' ? 'pt-10' : 'pt-0'
}`;
