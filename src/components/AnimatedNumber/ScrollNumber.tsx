import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

const useNumber = (number: Number) => {
  const numberList = String(number).split('');
  return numberList.map((item: string) => Number(item));
};

interface ScrollNumberItemProps {
  value: number;
  delay: number;
}

const sigleList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const ScrollNumberItem: React.FC<ScrollNumberItemProps> = (props) => {
  const { value, delay } = props;
  const translateY = useSharedValue(0);

  useEffect(() => {
    const dest = -value * 40;
    translateY.value = withDelay(
      delay * 50,
      withSpring(dest, { velocity: 100 })
    );
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <View style={styles.numberContainer}>
      <Animated.View style={[animatedStyle]}>
        {sigleList.map((item) => {
          return <Text style={styles.number}>{item}</Text>;
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  numberContainer: {
    height: 40,
    alignItems: 'center',
    overflow: 'hidden',
  },
  number: {
    fontSize: 40,
    fontWeight: 'bold',
    lineHeight: 40,
  },
});

interface ScrollNumberProps {
  value: number;
}

const ScrollNumber: React.FC<ScrollNumberProps> = (props) => {
  const { value } = props;
  const dataSource = useNumber(value);

  return (
    <View style={styles.container}>
      {dataSource.map((item, index) => {
        return <ScrollNumberItem delay={index} value={item} />;
      })}
    </View>
  );
};

export default ScrollNumber;
