import { getExpiryColorClass } from '@/constants/getExpiryColorsClass';
import { ProductDisplay } from '@/types/interfaces';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface ProductCardProps {
  product: ProductDisplay;
  // onUpdate: (product: ProductDisplay) => void;
  // onDelete: (product: ProductDisplay) => void;
  onTap?: (product: ProductDisplay) => void;
}

const ProductCard = ({
  product,
  // onUpdate,
  // onDelete,
  onTap,
}: ProductCardProps) => {
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });

  const SWIPE_THRESHOLD = -80;
  const ACTION_WIDTH = 160;

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate after 10px horizontal movement
    .failOffsetY([-5, 5]) // Fail if moved more than 5px vertically
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      // Only allow swiping left (negative values)
      translateX.value = Math.min(0, context.value.x + event.translationX);
    })
    .onEnd((event) => {
      const shouldReveal =
        translateX.value < SWIPE_THRESHOLD || event.velocityX < -1000;

      translateX.value = withSpring(shouldReveal ? -ACTION_WIDTH : 0);
    });

  const tap = Gesture.Tap().onStart(() => {
    if (translateX.value < -10) {
      // Hide actions if they're visible
      translateX.value = withSpring(0);
    } else if (onTap) {
      // Handle regular tap
      runOnJS(onTap)(product);
    }
  });

  const composed = Gesture.Simultaneous(pan, tap);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const hideActions = () => {
    translateX.value = withSpring(0);
  };

  const handleUpdate = () => {
    hideActions();
    Alert.alert(
      'Edit functionality will be soon.',
      'This feature is not yet implemented.'
    );
    // Todo: Uncomment the line below when the backend is ready
    // onUpdate(product);
  };

  const handleDelete = () => {
    hideActions();
    Alert.alert(
      'Delete functionality will be available soon.',
      'This feature is not yet implemented.'
    );
    // Todo: Uncomment the line below when the backend is ready
    // onDelete(product);
  };

  return (
    <View className='mb-3 relative'>
      {/* Action Buttons (behind the card) */}
      <View className='absolute right-0 top-0 bottom-0 flex-row'>
        <TouchableOpacity
          onPress={handleUpdate}
          className='bg-blue-500 justify-center items-center px-6 rounded-l-lg'
          style={{ width: ACTION_WIDTH / 2 }}
        >
          <MaterialIcons name='edit' size={20} color='white' />
          <Text className='text-white text-xs mt-1 font-medium'>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className='bg-primary justify-center items-center px-6 rounded-r-lg'
          style={{ width: ACTION_WIDTH / 2 }}
        >
          <MaterialIcons name='delete' size={20} color='white' />
          <Text className='text-white text-xs mt-1 font-medium'>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Main Card */}
      <GestureDetector gesture={composed}>
        <Animated.View style={animatedStyle}>
          <View className='flex-row justify-between items-center bg-white dark:bg-slate-800 rounded-lg gap-4'>
            <Image
              source={{ uri: product.imageUrl }}
              className='w-20 h-20 object-cover rounded-lg'
            />
            <View className='flex-1'>
              <Text className='text-base font-bold text-gray-800 dark:text-white'>
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

            <MaterialIcons
              name='keyboard-double-arrow-left'
              size={20}
              className='text-gray-500 dark:text-gray-400'
            />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default ProductCard;
