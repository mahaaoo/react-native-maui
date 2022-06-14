import React, { useCallback, useMemo } from "react";
import { TouchableOpacity, StyleProp, ViewStyle, StyleSheet, PixelRatio, Text } from "react-native";

export enum ButtonType {
  Primary = 1 << 1, 
  Default = 1 << 2,
  Link = 1 << 3,
}

interface ButtonProps {
  onPress: () => void;
  
  style?: StyleProp<ViewStyle>;
  type?: ButtonType;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { onPress, style, children, type, disabled = false } = props;

  const typeStyle = useMemo(() => {
    if (!!disabled && type !== ButtonType.Link) {
      return styles.disabled
    }
    switch (true) {
      case type === ButtonType.Primary:
        return styles.primary;
      case type === ButtonType.Default: 
        return styles.default;
      case type === ButtonType.Link: 
        return styles.link;
      default: 
        return styles.default;
    }
  }, [type, disabled]);

  const activeOpacity = useMemo(() => {
    return disabled ? 1 : 0.2;
  }, [disabled]);

  const handlePress = useCallback(() => {
    if (!!disabled) return;
    onPress && onPress();
  }, [onPress]);

  return (
    <TouchableOpacity 
      activeOpacity={activeOpacity}
      onPress={handlePress} 
      style={[typeStyle, style]}
    >
      {
        typeof children === 'string' ? <Text>{children}</Text> : children
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: {
    padding: 15,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2593FC',
  },
  default: {
    padding: 15,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    borderColor: '#D9D9D9',
    borderWidth: 1 / PixelRatio.get(),
  },
  link: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    padding: 15,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderColor: '#D9D9D9',
    borderWidth: 1 / PixelRatio.get(),
  }
});

export default Button;
