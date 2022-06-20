import React, { useMemo } from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

interface ShadowExampleProps {
  borderRadius: number;
};

const ShadowExample: React.FC<ShadowExampleProps> = props => {
  const {borderRadius = 15} = props;

  // const points = useMemo(() => {
  //   return {
  //     topLeft: `15, 7.5`,
  //     topRight: `165, 7.5`,
  //     bottomRight: `${y}, ${y}`,
  //     bottomLeft: `${x}, ${y}`,
  //   }
  // }, [])

  const options = useMemo(() => {
    const shadowWidth = 15;
    const lineLength = 150 - 2 * borderRadius;

    // top line H
    const x11 = (180 - 150) / 2 + borderRadius;
    const y11 = shadowWidth / 2;

    const x12 = x11 + lineLength;
    const y12 = y11;

    // right line V
    const x21 = 180 - shadowWidth/2;
    const y21 = shadowWidth + borderRadius;

    const x22 = x21;
    const y22 = y21 + lineLength;

    // bottom line H
    const x31 = x11;
    const y31 = 180 - shadowWidth/2;

    const x32 = x31 + lineLength;
    const y32 = y31;

    // left line V
    const x41 = shadowWidth/2;
    const y41 = shadowWidth + borderRadius;

    const x42 = x41;
    const y42 = y41 + lineLength;

    return {
      lineLength: lineLength,
      lineWidth: shadowWidth,
      x11, y11, x12, y12,
      x21, y21, x22, y22,
      x31, y31, x32, y32,
      x41, y41, x42, y42,
    }
  }, [])

  return (
    <View style={styles.container}>
      <Svg height={180} width={180} style={{ }}>
        <Defs>
          <LinearGradient id="top" x1="1" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#D8D8D8" stopOpacity="0" />
            <Stop offset="1" stopColor="#D8D8D8" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="right" x1="1" y1="0" x2="0" y2="0">
            <Stop offset="0" stopColor="#D8D8D8" stopOpacity="0" />
            <Stop offset="1" stopColor="#D8D8D8" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="bottom" x1="1" y1="1" x2="1" y2="0">
            <Stop offset="0" stopColor="#D8D8D8" stopOpacity="0" />
            <Stop offset="1" stopColor="#D8D8D8" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="left" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#D8D8D8" stopOpacity="0" />
            <Stop offset="1" stopColor="#D8D8D8" stopOpacity="1" />
          </LinearGradient>

          <RadialGradient 
            id="top-left" 
            r="100%" cx="100%" cy="100%" fx="100%" fy="100%">
            <Stop offset="0" stopColor="#D8D8D8" stopOpacity="0" />
            <Stop offset="1" stopColor="#D8D8D8" stopOpacity="1" />
          </RadialGradient>
          <RadialGradient 
            id="top-right" 
            r="50%" cx="50%" cy="50%" fx="0" fy="0">
            <Stop offset="0" stopColor="#D8D8D8" stopOpacity="0" />
            <Stop offset="1" stopColor="#D8D8D8" stopOpacity="1" />
          </RadialGradient>
          <RadialGradient 
            id="bottom-right" 
            r="100%" cx="100%" cy="100%" fx="100%" fy="100%">
            <Stop offset="0" stopColor="#D8D8D8" stopOpacity="0" />
            <Stop offset="1" stopColor="#D8D8D8" stopOpacity="1" />
          </RadialGradient>
          <RadialGradient 
            id="bottom-left" 
            r="100%" cx="0%" cy="0%" fx="0%" fy="0%">
            <Stop offset="0" stopColor="#D8D8D8" stopOpacity="0" />
            <Stop offset="1" stopColor="#D8D8D8" stopOpacity="1" />
          </RadialGradient>
        </Defs>

        <Path
          d={`M ${options.x11},${options.y11} L ${options.x12},${options.y12}`}
          stroke="url(#top)"
          strokeWidth={15}
        />
        <Path
          d={`M ${options.x21},${options.y21} L ${options.x22},${options.y22}`}
          stroke="url(#right)"
          strokeWidth={15}
        />
        <Path
          d={`M ${options.x31},${options.y31} L ${options.x32},${options.y32}`}
          stroke="url(#bottom)"
          strokeWidth={15}
        />
        <Path
          d={`M ${options.x41},${options.y41} L ${options.x42},${options.y42}`}
          stroke="url(#left)"
          strokeWidth={15}
        />

        <Path
          d={`M ${options.x41},${options.y41} A ${15 + 7.5} ${15 + 7.5} 0 0 1 ${options.x11},${options.y11}`}
          stroke="url(#top-left)"
          strokeWidth={15}
        />
        <Path
          d={`M ${options.x12},${options.y12} A ${15 + 7.5} ${15 + 7.5} 0 0 1 ${options.x21},${options.y21}`}
          stroke="url(#top-right)"
          strokeWidth={15}
        />
        <Path
          d={`M ${options.x42},${options.y42} A ${15 + 7.5} ${15 + 7.5} 0 0 0 ${options.x31},${options.y31}`}
          stroke="url(#bottom-left)"
          strokeWidth={15}
        />
        <Path
          d={`M ${options.x32},${options.y32} A ${15 + 7.5} ${15 + 7.5} 0 0 0 ${options.x22},${options.y22}`}
          stroke="url(#bottom-right)"
          strokeWidth={15}
        />

        <View style={{ 
          width: 150, height: 150, backgroundColor: 'pink', borderRadius: 15,
          position: 'absolute', left: 15, top: 15, right: 15, bottom: 15,
        }} />
      </Svg>

      <Svg height="150" width="150">
        <Defs>
        <RadialGradient
          id="grad"
          cx="105"
          cy="105"
          rx="105"
          ry="105"
          fx="105"
          fy="105"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#ff0" stopOpacity="1" />
          <Stop offset="1" stopColor="#83a" stopOpacity="1" />
        </RadialGradient>
        </Defs>
        <Rect 
          x="0" y="0" 
          width={150} height={150} 
          fill="url(#grad)"
          rx={10}
          ry={10}
        />
      </Svg>

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
})

export default ShadowExample;
