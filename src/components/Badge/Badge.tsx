import React, { useMemo } from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';

interface BadgeProps {
  number: number;

  size?: number;
  fontSize?: number;
  color?: string;
  style?: ViewStyle;
}

const Badge: React.FC<BadgeProps> = (props) => {
  const {
    number,
    size = 15,
    fontSize = 0.8 * size,
    color = '#fc4840',
    style,
  } = props;

  const content = useMemo(() => {
    if (number > 99) {
      return {
        title: '99+',
        width: 2 * size,
        height: 2 * size * 0.61,
        borderRadius: (2 * size * 0.61) / 2,
      };
    }
    if (number > 9) {
      return {
        title: number,
        width: 1.5 * size,
        height: 1.5 * size * 0.61,
        borderRadius: (1.5 * size * 0.61) / 2,
      };
    }
    return {
      title: number,
      width: size,
      height: size,
      borderRadius: size / 2,
    };
  }, [number, size]);

  if (!number || number === 0) {
    return <View />;
  }

  return (
    <View
      testID="MAUI-BADGE-ID"
      style={[
        styles.container,
        {
          height: content.height,
          borderRadius: content.borderRadius,
          width: content.width,
        },
        { backgroundColor: color },
        style,
      ]}
    >
      <Text style={[styles.textColor, { fontSize: fontSize }]}>
        {content.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColor: {
    color: '#fff',
  },
});

export default Badge;
