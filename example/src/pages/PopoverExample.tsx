import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useOverlay, OpacityContainer } from 'react-native-maui';

interface PopoverExampleProps {}

const PADDING = 20;

const PopoverExample: React.FC<PopoverExampleProps> = (props) => {
  const {} = props;
  const aref = useRef<View | null>(null);
  const { add } = useOverlay();

  const handleLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height: h, width: w },
      },
    }) => {
      console.log([h, w]);
    },
    []
  );

  const handleOnPress = useCallback(() => {
    aref?.current?.measure((x, y, width, height, pageX, pageY) => {
      console.log({
        x,
        y,
        width,
        height,
        pageX,
        pageY,
      });
      add(
        <OpacityContainer mask={false} modal={false}>
          <View
            style={{
              position: 'absolute',
              top: pageY - height - PADDING,
              left: pageX,
            }}
          >
            <View
              style={{
                height: 40,
                width: 60,
                backgroundColor: 'red',
                borderRadius: 5,
              }}
            >
              <Text>clike</Text>
            </View>
            <View style={styles.arrow} />
          </View>
        </OpacityContainer>
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleOnPress}
        ref={(ref) => (aref.current = ref)}
        onLayout={handleLayout}
        style={styles.content}
      >
        <Text>点击</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 100,
    height: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'red',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    marginLeft: PADDING,
  },
});

export default PopoverExample;
