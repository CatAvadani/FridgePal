import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const QuickActions = () => {
  const router = useRouter();

  const handleAddProduct = () => {
    router.push('/addProduct');
  };

  const handleTakePhoto = () => {
    router.push('/cameraScreen?from=takePhoto');
  };

  return (
    <View className='px-2 mb-2'>
      <View className='flex-row gap-2 bg-gray-100 p-2 rounded-xl dark:bg-gray-700/20'>
        <TouchableOpacity
          className='flex-1 flex-row items-center bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800'
          onPress={handleAddProduct}
          style={{ elevation: 3 }}
        >
          <View
            className='w-10 h-10 justify-center items-center bg-gray-100
              dark:bg-slate-800 rounded-lg mr-3'
          >
            <MaterialIcons name='add' size={20} color='#ff5733' />
          </View>
          <View className='flex-1'>
            <Text className='text-base  font-bold text-gray-800 dark:text-white'>
              Add Product
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className='flex-1 flex-row items-center bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800'
          onPress={handleTakePhoto}
          style={{ elevation: 3 }}
        >
          <View className='w-10 h-10 justify-center items-center bg-gray-100 rounded-lg mr-3 dark:bg-slate-800'>
            <MaterialIcons name='camera-alt' size={20} color='#ff5733' />
          </View>
          <View className='flex-1'>
            <Text className='text-base font-bold text-gray-800 dark:text-white'>
              Take Photo
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuickActions;
