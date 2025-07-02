import CategoryModal from '@/components/CategoryModal';
import { useProducts } from '@/contexts/ProductContext';
import { useAlert } from '@/hooks/useCustomAlert';
import { CATEGORIES, CreateProductRequest } from '@/types/interfaces';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddProductScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addProduct } = useProducts();
  const { showAlert } = useAlert();

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log('🔍 AddProduct useEffect - All params received:', params);

    if (params.photoUri && typeof params.photoUri === 'string') {
      console.log('Setting photo URI:', params.photoUri);
      setSelectedImageUri(params.photoUri);
    }

    // Handle prefilled data from AI analysis
    if (params.fromAI === 'true') {
      console.log(' AI Analysis data detected!');
      console.log('Product Name:', params.productName);
      console.log('Quantity:', params.quantity);
      console.log('Category ID:', params.categoryId);
      console.log('Expiration Date:', params.expirationDate);

      if (params.productName && typeof params.productName === 'string') {
        console.log('Setting product name:', params.productName);
        setProductName(params.productName);
      }
      if (params.quantity && typeof params.quantity === 'string') {
        console.log('Setting quantity:', params.quantity);
        setQuantity(params.quantity);
      }
      if (params.categoryId && typeof params.categoryId === 'string') {
        const categoryIdNum = parseInt(params.categoryId);
        console.log('Setting category ID:', categoryIdNum);
        setCategoryId(categoryIdNum);
      }
      if (params.expirationDate && typeof params.expirationDate === 'string') {
        console.log('Setting expiration date:', params.expirationDate);
        setExpirationDate(new Date(params.expirationDate));
      }
    } else {
      console.log(' No AI data detected. fromAI:', params.fromAI);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveImage = () => {
    setSelectedImageUri(null);
  };

  const handleAddImage = () => {
    router.push('/cameraScreen?from=addProduct');
  };

  const handleSave = async () => {
    if (!productName.trim()) {
      showAlert({ title: 'Error', message: 'Please enter a product name' });
      return;
    }
    const quantityNum = parseInt(quantity);
    if (!quantity.trim() || isNaN(quantityNum) || quantityNum <= 0) {
      showAlert({
        title: 'Error',
        message: 'Please enter a valid quantity (greater than 0)',
      });
      return;
    }
    if (!categoryId) {
      showAlert({ title: 'Error', message: 'Please select a category' });
      return;
    }
    try {
      setSaving(true);
      const newProduct: CreateProductRequest = {
        productName,
        quantity: quantityNum,
        expirationDate: expirationDate.toISOString(),
        categoryId,
      };
      await addProduct(newProduct, selectedImageUri);
      showAlert({
        title: 'Success',
        message: `Product "${productName}" added successfully!`,
        icon: 'check-circle',
      });
      router.replace('/');
    } catch {
      showAlert({
        title: 'Error',
        message: 'Failed to add product. Please try again.',
        icon: 'alert-circle',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <View className='bg-transparent border-b border-gray-200 dark:border-gray-700'>
        <View className='flex-row items-center justify-between px-4 py-3'>
          <TouchableOpacity onPress={() => router.replace('/')} className='p-2'>
            <MaterialIcons
              name='arrow-back'
              size={24}
              color={isDarkMode ? 'gray' : 'black'}
            />
          </TouchableOpacity>
          <Text className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Add Product
          </Text>
          <View className='w-10' />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <ScrollView className='flex-1 px-5 py-6'>
          {/* Image Section */}
          <View className='mb-4'>
            <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Product Image (Optional)
            </Text>
            {selectedImageUri ? (
              <View className='relative'>
                <Image
                  source={{ uri: selectedImageUri }}
                  className='w-full h-48 rounded-lg bg-gray-200 dark:bg-gray-700'
                  resizeMode='cover'
                />
                <TouchableOpacity
                  className='absolute top-2 right-2 bg-gray-200/40 border border-white/50 rounded-full p-2'
                  onPress={handleRemoveImage}
                >
                  <MaterialIcons name='close' size={20} color='red' />
                </TouchableOpacity>
                <TouchableOpacity
                  className='absolute top-2 left-2  bg-gray-200/40 border border-white/50 rounded-full p-2'
                  onPress={handleAddImage}
                >
                  <MaterialIcons name='edit' size={20} color='white' />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className='h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg justify-center items-center bg-gray-50 dark:bg-gray-800'
                onPress={handleAddImage}
              >
                <View className='items-center'>
                  <MaterialIcons
                    name='add-photo-alternate'
                    size={48}
                    color={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  />
                  <Text className='text-gray-500 dark:text-gray-400 mt-2'>
                    Tap to add product image
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Product Name */}
          <View className='mb-4'>
            <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Product Name
            </Text>
            <TextInput
              className='bg-white dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-white'
              placeholder='Enter product name'
              placeholderTextColor='#9CA3AF'
              value={productName}
              onChangeText={setProductName}
            />
          </View>

          {/* Quantity */}
          <View className='mb-4'>
            <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Quantity
            </Text>
            <TextInput
              className='bg-white dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-white'
              placeholder='Enter quantity'
              placeholderTextColor='#9CA3AF'
              value={quantity}
              onChangeText={setQuantity}
              keyboardType='numeric'
            />
          </View>

          {/* Category */}
          <View className='mb-4'>
            <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Category
            </Text>
            <TouchableOpacity
              className='bg-white dark:bg-gray-800 p-4 rounded-lg flex-row justify-between items-center'
              onPress={() => setShowCategoryModal(true)}
            >
              <Text className='text-gray-400 dark:text-white'>
                {categoryId
                  ? CATEGORIES.find((cat) => cat.categoryId === categoryId)
                      ?.categoryName
                  : 'Select category'}
              </Text>
              <MaterialIcons name='arrow-drop-down' size={24} color='#9CA3AF' />
            </TouchableOpacity>
          </View>

          {/* Expiration Date */}
          <View className='mb-4'>
            <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Expiration Date
            </Text>
            <TouchableOpacity
              className='bg-white dark:bg-gray-800 p-4 rounded-lg flex-row justify-between items-center'
              onPress={() => setShowDatePicker(true)}
            >
              <Text className='text-gray-400 dark:text-white'>
                {expirationDate.toLocaleDateString()}
              </Text>
              <MaterialIcons name='calendar-today' size={20} color='#9CA3AF' />
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={expirationDate}
              mode='date'
              display='default'
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setExpirationDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}

          {/* Action Buttons */}
          <View className='flex-row gap-4 mt-6'>
            <TouchableOpacity
              className='flex-1 button-secondary border border-primary dark:bg-transparent p-4 rounded-lg'
              onPress={() => router.back()}
              disabled={saving}
            >
              <Text className='text-center text-primary font-semibold'>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='flex-1 button-primary p-4 rounded-lg'
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color='white' />
              ) : (
                <Text className='text-center text-white font-semibold'>
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSelectCategory={setCategoryId}
        selectedCategoryId={categoryId}
      />
    </SafeAreaView>
  );
}
