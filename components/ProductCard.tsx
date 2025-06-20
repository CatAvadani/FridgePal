import { getExpiryColorClass } from '@/constants/getExpiryColorsClass';
import { ProductDisplay } from '@/types/interfaces';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface ProductCardProps {
  product: ProductDisplay;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <View className='flex-row justify-between items-center bg-white dark:bg-slate-800 rounded-lg mb-3 gap-4'>
      <Image
        source={{ uri: product.imageUrl }}
        className='w-20 h-20 object-cover rounded-lg'
      />
      <View className='flex-1'>
        <Text className='text-base font-medium text-gray-800 dark:text-white'>
          {product.productName} ({product.quantity})
        </Text>
        <Text
          className={`text-sm mt-1 ${getExpiryColorClass(product.daysUntilExpiry)}`}
        >
          {product.daysUntilExpiry === 0
            ? 'Expires today'
            : product.daysUntilExpiry === 1
              ? 'Expires tomorrow'
              : `Expires in ${product.daysUntilExpiry} days`}
        </Text>
      </View>
      <MaterialIcons name='chevron-right' size={24} color='#999' />
    </View>
  );
};

export default ProductCard;
