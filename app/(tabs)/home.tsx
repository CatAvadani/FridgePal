import ProductCard from '@/components/ProductCard';
import QuickActions from '@/components/QuickActions';
import StatsSummaryCard from '@/components/StatCard';
import { getUserDisplayName } from '@/constants/getUserDisplayName';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useAlert } from '@/hooks/useCustomAlert';
import { ProductDisplay } from '@/types/interfaces';
import { convertToProductDisplay } from '@/utils/productUtils';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { products, fetchProducts, deleteProduct } = useProducts();
  const { showAlert } = useAlert();
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const insets = useSafeAreaInsets();

  const userName = getUserDisplayName(user);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const productDisplays = useMemo(
    () => products.map(convertToProductDisplay),
    [products]
  );

  // Filter and sort products that are expiring within the next 10 days
  const expiringProducts = useMemo(
    () =>
      productDisplays
        .filter((p) => p.daysUntilExpiry <= 10)
        .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry),
    [productDisplays]
  );

  // Search filter (by productName or categoryName)
  const filteredExpiring = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return expiringProducts;
    return expiringProducts.filter(
      (p) =>
        (p.productName ?? '').toLowerCase().includes(q) ||
        (p.categoryName ?? '').toLowerCase().includes(q)
    );
  }, [expiringProducts, query]);

  // Calculate dashboard stats
  const totalProducts = productDisplays.length;
  const expiringCount = productDisplays.filter(
    (p) => p.daysUntilExpiry <= 10 && p.daysUntilExpiry >= 0
  ).length;
  const expiredCount = productDisplays.filter(
    (p) => p.daysUntilExpiry < 0
  ).length;
  const freshCount = totalProducts - expiringCount - expiredCount;

  // % of items that are fresh
  const freshnessRatio = useMemo(
    () => (totalProducts > 0 ? freshCount / totalProducts : 0),
    [freshCount, totalProducts]
  );

  // Dynamic fill color by health
  const healthFillColor = useMemo(() => {
    if (freshnessRatio >= 0.67) return '#10B981'; // green (good)
    if (freshnessRatio >= 0.33) return '#F59E0B'; // amber (ok)
    return '#EF4444'; // red (bad)
  }, [freshnessRatio]);

  const handleDeleteProduct = async (
    product: ProductDisplay
  ): Promise<void> => {
    try {
      await deleteProduct(product.itemId);
      showAlert({
        title: 'Deleted!',
        message: 'Product deleted successfully.',
        icon: 'check-circle',
        buttons: [{ text: 'OK', style: 'default' }],
      });
    } catch {
      showAlert({
        title: 'Error',
        message: 'Failed to delete product. Please try again.',
        icon: 'alert-circle',
        buttons: [{ text: 'OK', style: 'default' }],
      });
    }
  };

  const hasAlerts = expiringCount > 0;

  const handleLogout = () => {
    showAlert({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      icon: 'alert-circle',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Starting logout process...');
              await logout();
              console.log('Logout successful, navigating to login');
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Logout Failed', 'Please try again.');
            }
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StatusBar
          barStyle='dark-content'
          backgroundColor='transparent'
          translucent={true}
        />

        <View className='flex-row items-center justify-between m-4'>
          <View className='flex-row items-center'>
            <View className='w-10 h-10 bg-primary rounded-full mr-3 justify-center items-center'>
              <Text className='text-white font-bold'>{userName.charAt(0)}</Text>
            </View>
            <View>
              <Text className='text-2xl font-bold text-gray-800 dark:text-white'>
                FridgePal
              </Text>
              <Text className='text-sm text-gray-500 dark:text-gray-400'>
                Welcome, {userName}!
              </Text>
            </View>
          </View>

          <View className='flex-row items-center'>
            {hasAlerts && (
              <View style={{ position: 'relative', marginRight: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    showAlert({
                      title: `${expiringCount} Items Expiring Soon`,
                      message:
                        expiringProducts
                          .slice(0, 3)
                          .map((p) => p.productName)
                          .join(', ') + (expiringCount > 3 ? '...' : ''),
                      buttons: [
                        {
                          text: 'View All',
                          onPress: () =>
                            router.push('/inventory?filter=expiring'),
                        },
                        { text: 'OK', style: 'cancel' },
                      ],
                    });
                  }}
                  accessibilityRole='button'
                  accessibilityLabel='Notifications'
                >
                  <Feather name='bell' size={24} color='#6B7280' />
                </TouchableOpacity>
                <View
                  style={{
                    position: 'absolute',
                    right: -2,
                    top: -2,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#ef4444',
                  }}
                />
              </View>
            )}

            <TouchableOpacity
              onPress={handleLogout}
              accessibilityRole='button'
              accessibilityLabel='Logout'
            >
              <Feather name='power' size={22} color='#ef4444' />
            </TouchableOpacity>
          </View>
        </View>

        <View className='relative'>
          {/* Background Image */}
          <View className='h-48 mx-4 rounded-xl overflow-hidden'>
            <Image
              source={require('@/assets/images/Fridge_image.webp')}
              className='w-full h-full'
              resizeMode='cover'
            />

            <View className='absolute top-4 right-4'>
              <View className='bg-green-400/80 px-3 py-1 rounded-full'>
                <Text className='text-black text-xs font-bold'>
                  Keep Your Food Fresh{' '}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className='px-5 -mt-8'>
          <StatsSummaryCard
            freshCount={freshCount}
            expiringCount={expiringCount}
            expiredCount={expiredCount}
            onPress={(type) => {
              // need to wire this later to navigate
              console.log(`Navigate to ${type} items`);
            }}
          />
        </View>

        <View className='px-5 py-3'>
          <View className='flex-row items-center justify-between mb-2'>
            <Text className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Inventory Health
            </Text>
            <Text className='text-xs text-gray-500 dark:text-gray-400'>
              {totalProducts === 0
                ? 'No items yet'
                : `${Math.round(freshnessRatio * 100)}% fresh`}
            </Text>
          </View>

          <View
            className='h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'
            accessibilityRole='progressbar'
            accessibilityValue={{
              now: Math.round(freshnessRatio * 100),
              min: 0,
              max: 100,
            }}
          >
            <View
              className='h-full'
              style={{
                width: `${freshnessRatio * 100}%`,
                backgroundColor: healthFillColor,
              }}
            />
          </View>
        </View>

        <QuickActions />

        {/* Search */}
        <View className='px-4 mt-2 mb-4'>
          <View
            className={[
              'rounded-xl flex-row items-center p-2 h-16',
              'bg-white dark:bg-gray-800',
              isSearchFocused
                ? 'border border-gray-400 dark:border-gray-600'
                : 'border border-gray-200 dark:border-gray-400',
              'shadow-sm',
            ].join(' ')}
            style={{ elevation: 3 }}
          >
            <Feather
              name='search'
              size={20}
              color={isSearchFocused ? '#6B7280' : '#9CA3AF'}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder='Search by name or category'
              placeholderTextColor='#9CA3AF'
              returnKeyType='search'
              className='flex-1 ml-2 text-base text-gray-900 dark:text-white'
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery('')}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Feather name='x' size={18} color='#9CA3AF' />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className='px-5 mb-16'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-xl font-semibold text-gray-800 dark:text-white'>
              Expiring Products
            </Text>
            {filteredExpiring.length === 0 && (
              <Text className='text-sm text-green-600 dark:text-green-400 font-medium'>
                All fresh! 🎉
              </Text>
            )}
          </View>

          {filteredExpiring.length === 0 ? (
            <View className='bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800'>
              <Text className='text-center text-green-700 dark:text-green-300 font-medium'>
                Great job! No items expiring in the next 10 days.
              </Text>
              <Text className='text-center text-green-600 dark:text-green-400 text-sm mt-1'>
                Add more items to keep tracking your inventory.
              </Text>
            </View>
          ) : (
            filteredExpiring.map((product, index) => (
              <ProductCard
                key={product.itemId}
                product={product}
                isFirstCard={index === 0}
                onDelete={() => handleDeleteProduct(product)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
