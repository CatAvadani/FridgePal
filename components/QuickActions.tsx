import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const QuickActions = () => {
  const router = useRouter();

  return (
    <View className='px-5 mb-6'>
      <Text className='text-xl font-semibold text-gray-800 mb-4 dark:text-white'>
        Quick Actions
      </Text>
      <View className='flex-row gap-2'>
        <TouchableOpacity
          className='flex-1 flex-row items-center bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800'
          onPress={() => router.push('/addProduct')}
          style={{ elevation: 3 }}
        >
          <View
            className='w-10 h-10 justify-center items-center bg-gray-100
              dark:bg-slate-800 rounded-lg mr-3'
          >
            <MaterialIcons name='add' size={24} color='#ff5733' />
          </View>
          <View className='flex-1'>
            <Text className='text-base  font-semibold text-gray-800 dark:text-white'>
              Add Product
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className='flex-1 flex-row items-center bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800'
          onPress={() => router.push('/cameraScreen')}
          style={{ elevation: 3 }}
        >
          <View className='w-10 h-10 justify-center items-center bg-gray-100 rounded-lg mr-3 dark:bg-slate-800'>
            <MaterialIcons name='camera-alt' size={24} color='#ff5733' />
          </View>
          <View className='flex-1'>
            <Text className='text-base font-semibold text-gray-800 dark:text-white'>
              Take Photo
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuickActions;
