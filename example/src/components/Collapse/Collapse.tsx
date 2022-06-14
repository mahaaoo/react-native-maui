import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  useAnimatedRef,
  measure,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
  runOnUI,
} from "react-native-reanimated";

interface CollapseProps {
  title: string;
}

const Collapse: React.FC<CollapseProps> = props => {
  const {children, title} = props

  const open = useSharedValue(false);
  const aref = useAnimatedRef<View>();
  const height = useSharedValue(0);
  const transition = useDerivedValue(() => {
    return open.value === true ? withSpring(1) : withTiming(0);
  });

  const style = useAnimatedStyle(() => ({
    height: 1 + transition.value * height.value,
    opacity: transition.value === 0 ? 0 : 1,
  }));

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          if(height.value === 0) {
            runOnUI(() => {
              "worklet";
              height.value = measure(aref).height;
            })();
          }
          open.value = !open.value;
        }}
      >
        <Animated.View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.items, style]}>
        <View 
          ref={aref}
          onLayout={({
            nativeEvent: {
              layout: { height: h },
            },
          }) => height.value = h}
        >
          {children}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
