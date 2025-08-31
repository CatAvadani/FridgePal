import * as React from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';

type ButtonStyle = 'default' | 'cancel' | 'destructive';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: ButtonStyle;
}

export interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  icon?: string;
  buttons?: AlertButton[];
  onDismiss: () => void;
}

export default function CustomAlert({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onDismiss,
}: CustomAlertProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const theme = {
    colors: {
      primary: '#FF5733',
      surface: isDarkMode ? '#1F2937' : '#FFFFFF',
      onSurface: isDarkMode ? '#F9FAFB' : '#1F2937',
      onSurfaceVariant: isDarkMode ? '#9CA3AF' : '#6B7280',
      backdrop: 'rgba(0, 0, 0, 0.6)',
      error: '#EF4444',
      border: isDarkMode ? '#374151' : '#E5E7EB',
      cancel: isDarkMode ? '#6B7280' : '#9CA3AF',
    },
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{
          borderRadius: 24,
          backgroundColor: theme.colors.surface,
          marginHorizontal: 20,
          width: '90%',
          alignSelf: 'center',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          overflow: 'hidden',
        }}
        theme={theme}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              textAlign: 'center',
              color: theme.colors.onSurface,
              marginBottom: 16,
              lineHeight: 32,
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              textAlign: 'center',
              color: theme.colors.onSurfaceVariant,
              marginBottom: 32,
              lineHeight: 24,
            }}
          >
            {message}
          </Text>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            flexDirection: 'row',
            height: 56,
          }}
        >
          {buttons.map((btn, i) => {
            const isDestructive = btn.style === 'destructive';
            const isCancel = btn.style === 'cancel';
            const isLast = i === buttons.length - 1;

            return (
              <React.Fragment key={i}>
                <View style={{ flex: 1 }}>
                  <Button
                    onPress={() => {
                      btn.onPress?.();
                      onDismiss();
                    }}
                    style={{
                      height: 56,
                      borderRadius: 0,
                      justifyContent: 'center',
                    }}
                    labelStyle={{
                      fontSize: 18,
                      fontWeight: isCancel ? '500' : '600',
                      marginVertical: 0,
                    }}
                    textColor={
                      isDestructive
                        ? theme.colors.error
                        : isCancel
                          ? theme.colors.cancel
                          : theme.colors.primary
                    }
                    rippleColor={
                      isDestructive
                        ? `${theme.colors.error}15`
                        : isCancel
                          ? `${theme.colors.cancel}15`
                          : `${theme.colors.primary}15`
                    }
                    mode='text'
                    contentStyle={{
                      height: 56,
                      justifyContent: 'center',
                    }}
                  >
                    {btn.text}
                  </Button>
                </View>
                {!isLast && (
                  <View
                    style={{
                      width: 1,
                      height: 56,
                      backgroundColor: theme.colors.border,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </Dialog>
    </Portal>
  );
}
