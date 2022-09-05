import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

export interface BaseButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  withoutFeedback?: boolean;
}

const BaseButton: React.FC<BaseButtonProps> = (props) => {
  const {
    onPress,
    style,
    children,
    disabled = false,
    withoutFeedback = false,
  } = props;

  const activeOpacity = useMemo(() => {
    return disabled ? 1 : 0.2;
  }, [disabled]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    onPress && onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      testID="MAUI-BASE-BUTTON-ID"
      activeOpacity={withoutFeedback ? 1 : activeOpacity}
      onPress={handlePress}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
};

export default BaseButton;
