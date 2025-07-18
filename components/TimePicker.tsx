import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';

interface TimePickerProps {
  visible: boolean;
  initialTime: string;
  onTimeSelect: (timeString: string) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  visible,
  initialTime,
  onTimeSelect,
  onCancel,
  isDarkMode,
}) => {
  // Convert time string to Date object for picker
  const getTimePickerDate = () => {
    const [hours, minutes] = initialTime.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  };

  const handleDonePress = () => {
    const timeString = getTimePickerDate().toTimeString().slice(0, 5);
    onTimeSelect(timeString);
  };

  const handleAndroidTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'dismissed') {
      onCancel();
      return;
    }

    if (selectedTime) {
      const timeString = selectedTime.toTimeString().slice(0, 5);
      onTimeSelect(timeString);
    }
  };

  if (Platform.OS === 'ios') {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType='slide'
        onRequestClose={onCancel}
      >
        <View className='flex-1 justify-end bg-black/50'>
          <View className='bg-white dark:bg-gray-800 rounded-t-3xl'>
            <View className='flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
              <TouchableOpacity onPress={onCancel} className='px-4 py-2'>
                <Text className='text-blue-500 text-lg'>Cancel</Text>
              </TouchableOpacity>

              <Text className='text-lg font-semibold text-gray-800 dark:text-white'>
                Set Time
              </Text>

              <TouchableOpacity onPress={handleDonePress} className='px-4 py-2'>
                <Text className='text-blue-500 text-lg font-semibold'>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <View className='px-6 py-8'>
              <DateTimePicker
                value={getTimePickerDate()}
                mode='time'
                is24Hour={false}
                display='spinner'
                onChange={() => {}}
                textColor={isDarkMode ? 'white' : 'black'}
                style={{ height: 180 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Android
  return visible ? (
    <DateTimePicker
      value={getTimePickerDate()}
      mode='time'
      is24Hour={false}
      display='default'
      onChange={handleAndroidTimeChange}
    />
  ) : null;
};

export default TimePicker;
