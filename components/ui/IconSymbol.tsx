// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconSymbolName =
  | 'house.fill'
  | 'paperplane.fill'
  | 'chevron.left.forwardslash.chevron.right'
  | 'chevron.right'
  | 'globe'
  | 'gear'
  | 'gearshape'
  | 'gearshape.fill'
  | 'bell'
  | 'bell.fill'
  | 'plus'
  | 'plus.circle'
  | 'plus.circle.fill'
  | 'menu'
  | 'minus'
  | 'minus.circle'
  | 'minus.circle.fill'
  | 'menubar.rectangle';

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  globe: 'public',
  gear: 'settings',
  gearshape: 'settings',
  'gearshape.fill': 'settings',
  bell: 'notifications',
  'bell.fill': 'notifications',
  plus: 'add',
  'plus.circle': 'add-circle',
  'plus.circle.fill': 'add-circle',
  minus: 'remove',
  'minus.circle': 'remove-circle',
  'minus.circle.fill': 'remove-circle',
  'menubar.rectangle': 'list',
  menu: 'menu',
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
