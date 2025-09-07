import { headerClassName } from '@/constants/headerClassName';
import { MaterialIcons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Failed to open link:', error);
    }
  };

  const InfoRow = ({
    label,
    value,
    icon,
    onPress,
  }: {
    label: string;
    value: string;
    icon?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center justify-between py-4 px-4 ${onPress ? 'active:bg-gray-100' : ''}`}
    >
      <View className='flex-row items-center flex-1'>
        {icon && (
          <MaterialIcons
            name={icon as any}
            size={20}
            color='#9CA3AF'
            style={{ marginRight: 12 }}
          />
        )}
        <Text className='text-gray-700 dark:text-gray-300 font-medium'>
          {label}
        </Text>
      </View>
      <View className='flex-row items-center'>
        <Text className='text-gray-500 dark:text-gray-400 mr-2'>{value}</Text>
        {onPress && (
          <MaterialIcons name='open-in-new' size={16} color='#9CA3AF' />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <View className='bg-transparent dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4'>
        <View className={headerClassName}>
          <TouchableOpacity onPress={() => router.back()} className='p-2'>
            <MaterialIcons
              name='arrow-back'
              size={24}
              color={isDarkMode ? 'gray' : '#000'}
            />
          </TouchableOpacity>
          <Text className='text-2xl font-bold text-gray-800 dark:text-white'>
            About
          </Text>
          <View className='w-10' />
        </View>
      </View>

      <ScrollView className='flex-1'>
        {/* App Logo and Name Section */}
        <View className='items-center py-8 bg-white dark:bg-gray-800'>
          <Image
            source={require('@/assets/images/splash-icon.png')}
            style={{ width: 80, height: 80, borderRadius: 16 }}
            resizeMode='contain'
          />
          <Text className='text-2xl font-bold text-gray-900 dark:text-white mt-4'>
            FridgePal
          </Text>
          <Text className='text-gray-600 dark:text-gray-400 text-center px-6 mt-2'>
            Your Smart Fridge Companion
          </Text>
          <Text className='text-gray-500 dark:text-gray-500 text-sm mt-1'>
            Reduce food waste with AI-powered inventory management
          </Text>
        </View>

        {/* App Information */}
        <View className='bg-white dark:bg-gray-800 mt-4'>
          <Text className='text-gray-500 dark:text-gray-400 text-sm font-medium px-4 py-3 bg-gray-50 dark:bg-gray-700'>
            APP INFORMATION
          </Text>

          <InfoRow
            label='Version'
            value={Application.nativeApplicationVersion || '1.0.0'}
            icon='info'
          />

          <InfoRow
            label='Build'
            value={Application.nativeBuildVersion || '1'}
            icon='build'
          />

          <InfoRow
            label='Bundle ID'
            value={Application.applicationId || 'com.catalina-ava.FridgePal'}
            icon='fingerprint'
          />
        </View>

        {/* Developer Information */}
        <View className='bg-white dark:bg-gray-800 mt-4'>
          <Text className='text-gray-500 dark:text-gray-400 text-sm font-medium px-4 py-3 bg-gray-50 dark:bg-gray-700'>
            DEVELOPER
          </Text>

          <InfoRow label='Created by' value='Catalina Avadani' icon='person' />

          <InfoRow
            label='🏆 Clean Code Hackathon'
            value='2025 Winner'
            icon='emoji-events'
          />

          <InfoRow
            label='GitHub'
            value='View Source Code'
            icon='code'
            onPress={() => openLink('https://github.com/CatAvadani/FridgePal')}
          />

          <InfoRow
            label='LinkedIn'
            value='Connect with Developer'
            icon='person'
            onPress={() => openLink('https://linkedin.com/in/catalina-avadani')}
          />
        </View>

        {/* Legal Information */}
        <View className='bg-white dark:bg-gray-800 mt-4'>
          <Text className='text-gray-500 dark:text-gray-400 text-sm font-medium px-4 py-3 bg-gray-50 dark:bg-gray-700'>
            LEGAL
          </Text>

          <InfoRow
            label='Privacy Policy'
            value='How we handle your data'
            icon='privacy-tip'
            onPress={() =>
              openLink('https://catavadani.github.io/fridgepal-privacy/')
            }
          />

          <InfoRow
            label='Terms of Service'
            value='Coming Soon'
            icon='description'
          />

          <InfoRow
            label='Open Source Licenses'
            value='View Licenses'
            icon='article'
            onPress={() =>
              openLink(
                'https://github.com/CatAvadani/FridgePal/blob/main/LICENSE'
              )
            }
          />
        </View>

        {/* Technology Stack */}
        <View className='bg-white dark:bg-gray-800 mt-4 mb-6'>
          <Text className='text-gray-500 dark:text-gray-400 text-sm font-medium px-4 py-3 bg-gray-50 dark:bg-gray-700'>
            BUILT WITH
          </Text>

          <InfoRow
            label='React Native'
            value='Cross-platform framework'
            icon='phone-android'
          />

          <InfoRow
            label='Expo'
            value='Development platform'
            icon='rocket-launch'
          />

          <InfoRow label='Supabase' value='Backend & database' icon='storage' />

          <InfoRow
            label='OpenAI'
            value='AI-powered recognition'
            icon='psychology'
          />
        </View>

        {/* Footer */}
        <View className='items-center py-6 px-6'>
          <Text className='text-gray-500 dark:text-gray-400 text-center text-sm'>
            FridgePal v1.0.0 • Made by Catalina Avadani to help reduce food
            waste
          </Text>
          <Text className='text-gray-400 dark:text-gray-500 text-center text-xs mt-2'>
            © 2025 Catalina Avadani. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
