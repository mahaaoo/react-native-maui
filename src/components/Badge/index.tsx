import React, {useMemo} from 'react';
import {View, StyleSheet, Text} from 'react-native';

interface BadgeProps {
  number: number;

  size?: number;
  fontSize?: number;
  color?: string;
}

const Badge: React.FC<BadgeProps> = props => {
  const {
    number, 
    size = 12, 
    fontSize = 0.8 * size,
    color = '#fc4840',
  } = props;

  const content = useMemo(() => {
    if (number > 99) {
      return {
        title: '99+',
        width: 2 * size,
      };
    }
    if (number > 9) {
      return {
        title: number,
        width: 1.5 * size,
      };
    }
    return {
      title: number,
      width: size,
    };
  }, [number, size]);

  if (!number || number === 0) {
    return <View />;
  }

  return (
    <View
      style={[
        styles.container,
        {height: size, borderRadius: size / 2, width: content.width},
        {backgroundColor: color}
      ]}>
      <Text style={{fontSize: fontSize, color: '#fff'}}>
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
});

export default Badge;
