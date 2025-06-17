import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ExpiringItem {
  id: string;
  name: string;
  daysUntilExpiry: number;
  category: string;
}

export default function HomeScreen() {
  const userName = 'Cat';
  const expiringItems: ExpiringItem[] = [
    { id: '1', name: 'Milk', daysUntilExpiry: 3, category: 'dairy' },
    { id: '2', name: 'Eggs', daysUntilExpiry: 5, category: 'dairy' },
    { id: '3', name: 'Butter', daysUntilExpiry: 7, category: 'dairy' },
    { id: '4', name: 'Cheese', daysUntilExpiry: 10, category: 'dairy' },
  ];

  const getExpiryColorClass = (days: number) => {
    if (days <= 0) return 'text-red-700';
    if (days <= 3) return 'text-red-500';
    if (days <= 5) return 'text-orange-500';
    if (days <= 7) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='bg-white px-5 py-4 border-b border-gray-200'>
        <Text className='text-2xl font-bold text-gray-800'>FridgePal</Text>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View className='px-5 py-6'>
          <Text className='text-3xl font-bold text-gray-800'>
            Welcome, {userName}!
          </Text>
          <Text className='text-base text-gray-600 mt-1'>
            Manage your fridge efficiently
          </Text>
        </View>

        {/* Quick Actions */}
        <View className='px-5 mb-6'>
          <Text className='text-xl font-semibold text-gray-800 mb-4'>
            Quick Actions
          </Text>
          <View className='flex-row gap-2'>
            <TouchableOpacity
              className='flex-1 flex-row items-center bg-white p-4 rounded-xl shadow-sm'
              // onPress={handleAddProduct}
              style={{ elevation: 3 }}
            >
              <View className='w-10 h-10 justify-center items-center bg-gray-100 rounded-full mr-3'>
                <MaterialIcons name='add' size={24} color='#2196F3' />
              </View>
              <View className='flex-1'>
                <Text className='text-base font-semibold text-gray-800'>
                  Add Product
                </Text>
                <Text className='text-xs text-gray-500 mt-0.5'>
                  Add new items...
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className='flex-1 flex-row items-center bg-white p-4 rounded-xl shadow-sm'
              // onPress={handleScanProduct}
              style={{ elevation: 3 }}
            >
              <View className='w-10 h-10 justify-center items-center bg-gray-100 rounded-full mr-3'>
                <MaterialIcons
                  name='qr-code-scanner'
                  size={24}
                  color='#4CAF50'
                />
              </View>
              <View className='flex-1'>
                <Text className='text-base font-semibold text-gray-800'>
                  Scan Product
                </Text>
                <Text className='text-xs text-gray-500 mt-0.5'>
                  Scan items usi...
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Expiring Products List */}
        <View className='px-5 mb-6'>
          <Text className='text-xl font-semibold text-gray-800 mb-4'>
            Expiring Products
          </Text>

          {expiringItems.map((item) => (
            <View
              key={item.id}
              className='flex-row justify-between items-center bg-white p-4 rounded-lg mb-3'
            >
              <View className='flex-1'>
                <Text className='text-base font-medium text-gray-800'>
                  {item.name}
                </Text>
                <Text
                  className={`text-sm mt-1 ${getExpiryColorClass(item.daysUntilExpiry)}`}
                >
                  {item.daysUntilExpiry === 0
                    ? 'Expires today'
                    : item.daysUntilExpiry === 1
                      ? 'Expires tomorrow'
                      : `Expires in ${item.daysUntilExpiry} days`}
                </Text>
              </View>
              <MaterialIcons name='chevron-right' size={24} color='#999' />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
