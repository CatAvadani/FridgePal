import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddProductScreen() {
  const router = useRouter();
  const [values, setValues] = useState({
    name: '',
    category: '',
    expirationDate: '',
  });

  const handleSave = () => {
    if (!values.name.trim()) {
      Alert.alert('Missing info', 'Please enter a product name.');
      return;
    }
    router.back();
  };

  return (
    <View className='flex-1 p-6 justify-center bg-white dark:bg-gray-900 gap-4'>
      <Text className='mb-2 text-2xl font-bold'>Add Product</Text>

      <TextInput
        placeholder='Product Name'
        value={values.name}
        onChangeText={(text) => setValues({ ...values, name: text })}
        className='text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md p-4'
      />
      <TextInput
        placeholder='Category'
        value={values.category}
        onChangeText={(text) => setValues({ ...values, category: text })}
        className='text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md p-4'
      />
      <TextInput
        placeholder='Expiration Date (YYYY-MM-DD)'
        value={values.expirationDate}
        onChangeText={(text) => setValues({ ...values, expirationDate: text })}
        className='text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md p-4'
      />

      <View className='mt-4 flex-row justify-center gap-4'>
        <TouchableOpacity
          onPress={() => router.back()}
          className='bg-gray-300 dark:bg-gray-700 px-10 py-4 rounded-md'
        >
          <Text className='text-black dark:text-white font-bold'>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          className='bg-blue-500 px-10 py-4 rounded-md'
        >
          <Text className='text-white font-bold'>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
