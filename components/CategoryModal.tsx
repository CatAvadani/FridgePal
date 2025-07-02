import { CATEGORIES } from '@/types/interfaces';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: number) => void;
  selectedCategoryId?: number | null;
}

export default function CategoryModal({
  visible,
  onClose,
  onSelectCategory,
  selectedCategoryId,
}: CategoryModalProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleSelectCategory = (categoryId: number) => {
    onSelectCategory(categoryId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className='flex-1 bg-black/50 justify-center items-center px-5'
        activeOpacity={1}
        onPress={onClose}
      >
        <View className='bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-96 w-full'>
          {/* Header */}
          <View className='p-4 border-b border-gray-200 dark:border-gray-700 flex-row items-center justify-between'>
            <Text className='text-lg font-semibold text-gray-900 dark:text-white flex-1 text-center'>
              Select Category
            </Text>
            <TouchableOpacity onPress={onClose} className='p-1'>
              <MaterialIcons
                name='close'
                size={24}
                color={isDarkMode ? '#9CA3AF' : '#6B7280'}
              />
            </TouchableOpacity>
          </View>

          {/* Categories List */}
          <ScrollView className='max-h-80'>
            {CATEGORIES.map((cat, index) => (
              <TouchableOpacity
                key={cat.categoryId}
                className={`p-4 flex-row items-center justify-between ${
                  index < CATEGORIES.length - 1
                    ? 'border-b border-gray-200 dark:border-gray-700'
                    : ''
                }`}
                onPress={() => handleSelectCategory(cat.categoryId)}
              >
                <Text className='text-gray-600 dark:text-white flex-1'>
                  {cat.categoryName}
                </Text>
                {selectedCategoryId === cat.categoryId && (
                  <MaterialIcons
                    name='check'
                    size={20}
                    color={isDarkMode ? '#10B981' : '#059669'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
