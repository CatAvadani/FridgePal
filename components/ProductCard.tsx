import { getExpiryColorClass } from '@/constants/getExpiryColorsClass';
import { useProducts } from '@/contexts/ProductContext';
import { ProductDisplay } from '@/types/interfaces';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

interface ProductCardProps {
  product: ProductDisplay;
  onTap?: (product: ProductDisplay) => void;
  isFirstCard?: boolean;
}

const SWIPE_THRESHOLD = -80;
const ACTION_WIDTH = 160;
const DEMO_REVEAL = -120;

const ProductCard = ({
  product,
  onTap,
  isFirstCard = false,
}: ProductCardProps) => {
  const router = useRouter();
  const { deleteProduct } = useProducts();
  const [hasSeenDemo, setHasSeenDemo] = useState(true);

  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });

  const startDemoAnimation = useCallback(async () => {
    try {
      await AsyncStorage.setItem('hasSeenSwipeDemo', 'true');
      setHasSeenDemo(true);
    } catch (error) {
      console.log('Error saving demo status:', error);
    }

    // Animation: slide out - pause - slide back
    translateX.value = withSequence(
      withDelay(
        500,
        withSpring(DEMO_REVEAL, {
          duration: 800,
          dampingRatio: 0.8,
        })
      ),
      withDelay(
        1500,
        withSpring(0, {
          duration: 600,
          dampingRatio: 0.8,
        })
      )
    );
  }, [translateX]);

  useEffect(() => {
    // This line is added for demo purposes to reset the demo status
    // TODO: Remove this line in production to keep demo status persistent
    AsyncStorage.removeItem('hasSeenSwipeDemo');

    const checkDemoStatus = async () => {
      try {
        const hasSeenBefore = await AsyncStorage.getItem('hasSeenSwipeDemo');
        const shouldShowDemo = hasSeenBefore !== 'true' && isFirstCard;
        setHasSeenDemo(hasSeenBefore === 'true');

        if (shouldShowDemo) {
          setTimeout(() => {
            startDemoAnimation();
          }, 1000);
        }
      } catch (error) {
        console.log('Error checking demo status:', error);
      }
    };

    if (isFirstCard) {
      checkDemoStatus();
    }
  }, [isFirstCard, startDemoAnimation]);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-5, 5])
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
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
    router.push({
      pathname: '/editProduct',
      params: { productId: product.itemId },
    });
  };

  const handleDelete = () => {
    hideActions();
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.productName}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(product.itemId);
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to delete product. Please try again.'
              );
              console.error('Error deleting product:', error);
            }
          },
        },
      ]
    );
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

      {/* Demo Hint only show during first-time demo */}
      {isFirstCard && !hasSeenDemo && (
        <View className='absolute -top-8 left-4 bg-black px-3 py-1 rounded-full z-10'>
          <Text className='text-white text-xs font-medium'>
            Swipe cards for options!
          </Text>
        </View>
      )}

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
                {product.daysUntilExpiry < 0
                  ? `Expired ${Math.abs(product.daysUntilExpiry)} ${Math.abs(product.daysUntilExpiry) === 1 ? 'day' : 'days'} ago`
                  : product.daysUntilExpiry === 0
                    ? 'Expires today'
                    : product.daysUntilExpiry === 1
                      ? 'Expires tomorrow'
                      : `Expires in ${product.daysUntilExpiry} days`}
              </Text>
            </View>

            <MaterialIcons
              name='keyboard-double-arrow-left'
              size={20}
              className='text-gray-500 dark:text-gray-400 mr-2'
            />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default ProductCard;
