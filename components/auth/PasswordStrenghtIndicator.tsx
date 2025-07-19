import React from 'react';
import { Text, View } from 'react-native';

interface PasswordStrength {
  score: number;
  feedback: string;
  color: string;
}

const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const checks = [
    { test: /.{8,}/, points: 1 },
    { test: /[a-z]/, points: 1 },
    { test: /[A-Z]/, points: 1 },
    { test: /[0-9]/, points: 1 },
    { test: /[^a-zA-Z0-9]/, points: 1 },
    { test: /.{12,}/, points: 1 },
  ];

  checks.forEach((check) => {
    if (check.test.test(password)) score += check.points;
  });

  if (score <= 2) {
    return { score, feedback: 'Weak', color: '#EF4444' };
  } else if (score <= 4) {
    return { score, feedback: 'Medium', color: '#F59E0B' };
  } else {
    return { score, feedback: 'Strong', color: '#10B981' };
  }
};

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const strength = checkPasswordStrength(password);

  return (
    <View className='mt-2'>
      <View className='flex-row items-center mb-1'>
        <Text className='text-sm text-gray-600 dark:text-gray-400 mr-2'>
          Password strength:
        </Text>
        <Text className='text-sm font-medium' style={{ color: strength.color }}>
          {strength.feedback}
        </Text>
      </View>
      <View className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
        <View
          className='h-full transition-all duration-300 rounded-full'
          style={{
            backgroundColor: strength.color,
            width: `${(strength.score / 6) * 100}%`,
          }}
        />
      </View>
    </View>
  );
}
