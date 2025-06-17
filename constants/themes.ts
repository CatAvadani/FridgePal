import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

export const customLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3B82F6',
    background: '#FFFFFF',
    card: '#F9FAFB',
    text: '#1F2937',
    border: '#E5E7EB',
    notification: '#EF4444',
  },
};

export const customDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#60A5FA',
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    border: '#374151',
    notification: '#F87171',
  },
};
