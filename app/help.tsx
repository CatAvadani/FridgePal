import { headerClassName } from '@/constants/headerClassName';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HelpSupportScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Failed to open link:', error);
      Alert.alert('Error', 'Unable to open link');
    }
  };

  const sendEmail = () => {
    const email = 'catalina.avadani@gmail.com';
    const subject = 'FridgePal Support Request';
    const body =
      'Hi Catalina,\n\nI need help with FridgePal:\n\n[Please describe your issue]\n\nApp Version: 1.0.0\nDevice: [Your device info]\n\nThanks!';

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    openLink(mailtoUrl);
  };

  const HelpItem = ({
    title,
    description,
    icon,
    onPress,
  }: {
    title: string;
    description: string;
    icon: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`p-4 bg-white dark:bg-gray-800 mb-3 rounded-lg ${onPress ? 'active:bg-gray-50' : ''}`}
    >
      <View className='flex-row items-start'>
        <View className='w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3'>
          <MaterialIcons name={icon as any} size={20} color='#ff5733' />
        </View>
        <View className='flex-1'>
          <Text className='text-gray-900 dark:text-white font-semibold mb-1'>
            {title}
          </Text>
          <Text className='text-gray-600 dark:text-gray-400 text-sm leading-5'>
            {description}
          </Text>
          {onPress && (
            <View className='flex-row items-center mt-2'>
              <Text className='text-primary text-sm font-medium mr-1'>
                Learn more
              </Text>
              <MaterialIcons name='arrow-forward' size={14} color='#ff5733' />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const ContactOption = ({
    title,
    description,
    icon,
    onPress,
  }: {
    title: string;
    description: string;
    icon: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className='flex-row items-center p-4 bg-white dark:bg-gray-800 rounded-lg mb-3 active:bg-gray-50'
    >
      <View className='w-12 h-12 bg-primary rounded-full items-center justify-center mr-4'>
        <MaterialIcons name={icon as any} size={24} color='white' />
      </View>
      <View className='flex-1'>
        <Text className='text-gray-900 dark:text-white font-semibold'>
          {title}
        </Text>
        <Text className='text-gray-600 dark:text-gray-400 text-sm'>
          {description}
        </Text>
      </View>
      <MaterialIcons name='chevron-right' size={24} color='#9CA3AF' />
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
            Help & Support
          </Text>
          <View className='w-10' />
        </View>
      </View>

      <ScrollView className='flex-1 p-4'>
        {/* Quick Help Section */}
        <Text className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
          Frequently Asked Questions
        </Text>

        <HelpItem
          title='How do I add products to my inventory?'
          description="Tap the 'Add Product' button on the home screen, or use 'Take Photo' to scan items with AI recognition."
          icon='add-circle'
        />

        <HelpItem
          title='How does AI food recognition work?'
          description='Take a photo of your food items and our AI will identify them and suggest expiration dates automatically.'
          icon='camera-alt'
        />

        <HelpItem
          title='How do I set up notifications?'
          description='Go to Settings > Notifications to enable alerts and set your preferred notification time.'
          icon='notifications'
        />

        <HelpItem
          title='Can I edit or delete products?'
          description='Yes! Tap on any product in your inventory to edit details or swipe to delete items.'
          icon='edit'
        />

        <HelpItem
          title='How do I backup my data?'
          description="Your data is automatically synced to the cloud when you're signed in. No manual backup needed!"
          icon='cloud-done'
        />

        <HelpItem
          title='Is my data secure?'
          description='Yes! We use industry-standard encryption and never share your personal information.'
          icon='security'
          onPress={() =>
            openLink('https://catavadani.github.io/fridgepal-privacy/')
          }
        />

        {/* Contact Section */}
        <Text className='text-lg font-bold text-gray-900 dark:text-white mb-4 mt-8'>
          Need More Help?
        </Text>

        <ContactOption
          title='Email Support'
          description='Get help via email - we usually respond within 24 hours'
          icon='email'
          onPress={sendEmail}
        />

        <ContactOption
          title='GitHub Issues'
          description='Report bugs or request features on our GitHub repository'
          icon='bug-report'
          onPress={() =>
            openLink('https://github.com/CatAvadani/FridgePal/issues')
          }
        />

        <ContactOption
          title='Privacy Policy'
          description='Learn how we handle and protect your data'
          icon='privacy-tip'
          onPress={() =>
            openLink('https://catavadani.github.io/fridgepal-privacy/')
          }
        />

        {/* Tips Section */}
        <Text className='text-lg font-bold text-gray-900 dark:text-white mb-4 mt-8'>
          Pro Tips
        </Text>

        <View className='bg-gradient-to-r from-primary/10 to-orange-100 dark:from-primary/20 dark:to-orange-900/20 p-4 rounded-lg mb-4'>
          <View className='flex-row items-start'>
            <MaterialIcons
              name='lightbulb'
              size={20}
              color='#ff5733'
              style={{ marginRight: 8, marginTop: 2 }}
            />
            <View className='flex-1'>
              <Text className='text-gray-900 dark:text-white font-semibold mb-2'>
                Maximize Food Freshness
              </Text>
              <Text className='text-gray-700 dark:text-gray-300 text-sm'>
                • Take photos immediately after grocery shopping{'\n'}• Set
                notifications 1-2 days before expiry{'\n'}• Use the category
                filters to organize better{'\n'}• Check your inventory before
                shopping
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className='items-center py-6'>
          <Text className='text-gray-500 dark:text-gray-400 text-center text-sm'>
            FridgePal v1.0.0 • Made by Catalina Avadani
          </Text>
          <Text className='text-gray-400 dark:text-gray-500 text-center text-xs mt-1'>
            Help us reduce food waste, one fridge at a time
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportScreen;
