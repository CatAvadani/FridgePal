import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StatsSummaryProps {
  freshCount: number;
  expiringCount: number;
  expiredCount: number;
  onPress?: (type: 'fresh' | 'expiring' | 'expired') => void;
}

export const StatsSummaryCard: React.FC<StatsSummaryProps> = ({
  freshCount,
  expiringCount,
  expiredCount,
  onPress,
}) => {
  return (
    <View className='bg-white dark:bg-gray-800 rounded-xl px-4 py-3 mx-5 mb-4 shadow-sm border border-gray-200 dark:border-gray-700'>
      <View className='flex-row items-center justify-between'>
        {/* Fresh */}
        <TouchableOpacity
          onPress={() => onPress?.('fresh')}
          className='flex-1 items-center'
        >
          <View className='flex-row items-center mb-1'>
            <View className='w-2 h-2 bg-green-500 rounded-full mr-2' />
            <Text className='text-xs text-gray-600 dark:text-gray-400 font-medium'>
              FRESH
            </Text>
          </View>
          <Text className='text-xl font-bold text-gray-900 dark:text-white'>
            {freshCount}
          </Text>
        </TouchableOpacity>

        {/* Separator */}
        <View className='w-px h-8 bg-gray-200 dark:bg-gray-600 mx-4' />

        {/* Expiring */}
        <TouchableOpacity
          onPress={() => onPress?.('expiring')}
          className='flex-1 items-center'
        >
          <View className='flex-row items-center mb-1'>
            <View className='w-2 h-2 bg-orange-500 rounded-full mr-2' />
            <Text className='text-xs text-gray-600 dark:text-gray-400 font-medium'>
              EXPIRING
            </Text>
          </View>
          <Text className='text-xl font-bold text-gray-900 dark:text-white'>
            {expiringCount}
          </Text>
        </TouchableOpacity>

        {/* Separator */}
        <View className='w-px h-8 bg-gray-200 dark:bg-gray-600 mx-4' />

        {/* Expired */}
        <TouchableOpacity
          onPress={() => onPress?.('expired')}
          className='flex-1 items-center'
        >
          <View className='flex-row items-center mb-1'>
            <View className='w-2 h-2 bg-red-500 rounded-full mr-2' />
            <Text className='text-xs text-gray-600 dark:text-gray-400 font-medium'>
              EXPIRED
            </Text>
          </View>
          <Text className='text-xl font-bold text-gray-900 dark:text-white'>
            {expiredCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Option 2: Smaller individual cards
interface MiniStatCardProps {
  title: string;
  count: number;
  color: 'green' | 'orange' | 'red';
  onPress?: () => void;
}

export const MiniStatCard: React.FC<MiniStatCardProps> = ({
  title,
  count,
  color,
  onPress,
}) => {
  const getDotColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'orange':
        return 'bg-orange-500';
      case 'red':
        return 'bg-red-500';
    }
  };

  const CardContent = () => (
    <View className='flex-1 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700'>
      <View className='flex-row items-center mb-1'>
        <View className={`w-1.5 h-1.5 ${getDotColor()} rounded-full mr-1.5`} />
        <Text className='text-xs text-gray-600 dark:text-gray-400 font-medium uppercase'>
          {title}
        </Text>
      </View>
      <Text className='text-lg font-bold text-gray-900 dark:text-white'>
        {count}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} className='flex-1'>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

// Default export - you can switch between these two options
export default StatsSummaryCard;
