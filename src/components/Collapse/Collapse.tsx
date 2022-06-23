import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

interface CollapseProps {
  title: string;
  toggle?: boolean;
  onChange?: () => void;
}

const Collapse: React.FC<CollapseProps> = props => {
  const {children, title, onChange, toggle = false} = props;

  const open = useSharedValue(toggle);
  const height = useSharedValue(0);
  const transition = useDerivedValue(() => {
    return open.value === true ? withTiming(1) : withTiming(0);
  });

  const handleLayout = useCallback(({
    nativeEvent: {
      layout: { height: h },
    },
  }) => {
    height.value = h;
  }, []);

  const handleOnPress = useCallback(() => {
    open.value = !open.value;
    onChange && onChange();
  }, [onChange]);

  const style = useAnimatedStyle(() => {
    return {
      height: transition.value * height.value + 1,
      opacity: transition.value === 0 ? 0 : 1,
    }
  });

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback  onPress={handleOnPress}>
        <Animated.View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.items, style]}>
        <View onLayout={handleLayout}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  titleContainer: {
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  items: {
    overflow: "hidden",
  },
});

export default Collapse;
