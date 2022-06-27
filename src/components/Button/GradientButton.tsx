import React, { useCallback, useRef } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import BaseButton from './BaseButton';

interface GradientButtonProps {
  colors: string[];
  width: number;
  height: number;

  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  start?: { x: number, y: number },
  end?: { x: number, y: number },
};

const Gradient: React.FC<GradientButtonProps> = props => {
  const {
    colors, 
    start = {x: 0, y: 0}, 
    end={x:1, y:0}, 
    width = 100, 
    height = 50, 
    borderWidth = 2, 
    borderColor = '#FFF',
    borderRadius = 10,
  } = props;
  return (
    <View>
      <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="button_background" x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
            {
              Array.isArray(colors) && colors?.map((color, index) => {
                return <Stop key={`button_background_${index}`} offset={index/colors.length} stopColor={color} stopOpacity="1" />
              })
            }
            </LinearGradient>
          </Defs>
          <Rect
            ry={borderRadius}
            rx={borderRadius}
            x={borderWidth}
            y={borderWidth}
            width={width-2*borderWidth}
            height={height-2*borderWidth}
            fill="url(#button_background)"
            stroke={borderColor}
            strokeWidth={borderWidth}
          />
      </Svg>
      <BaseButton onPress={() => {}} style={[styles.container]}>
        <Text>按钮</Text>
      </BaseButton>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Gradient;
