import React, { useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

interface ShadowProps {
  borderRadius?: number;
  color?: string;
  shadowWidth?: number;
  stopOpacity?: number;
}

const Shadow: React.FC<ShadowProps> = (props) => {
  const {
    borderRadius = 0,
    children,
    color = '#F8F8F8',
    shadowWidth = 15,
    stopOpacity = 1,
  } = props;
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
  });

  const handleLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width, height },
      },
    }) => {
      setViewport({
        width,
        height,
      });
    },
    []
  );

  const options = useMemo(() => {
    const { width, height } = viewport;

    const xAxisLength = width - 2 * borderRadius;
    const yAxisLength = height - 2 * borderRadius;

    // top line H
    const x11 = shadowWidth + borderRadius;
    const y11 = shadowWidth / 2;

    const x12 = x11 + xAxisLength;
    const y12 = y11;

    // right line V
    const x21 = width + 2 * shadowWidth - shadowWidth / 2;
    const y21 = shadowWidth + borderRadius;

    const x22 = x21;
    const y22 = y21 + yAxisLength;

    // bottom line H
    const x31 = x11;
    const y31 = height + 2 * shadowWidth - shadowWidth / 2;

    const x32 = x31 + xAxisLength;
    const y32 = y31;

    // left line V
    const x41 = shadowWidth / 2;
    const y41 = shadowWidth + borderRadius;

    const x42 = x41;
    const y42 = y41 + yAxisLength;

    const circleR = borderRadius + shadowWidth / 2;

    return {
      x11,
      y11,
      x12,
      y12,
      x21,
      y21,
      x22,
      y22,
      x31,
      y31,
      x32,
      y32,
      x41,
      y41,
      x42,
      y42,
      circleR,
      xAxisLength,
      yAxisLength,
    };
  }, [viewport, shadowWidth, borderRadius]);

  const renderBorder = () => {
    const ios = Platform.OS === 'ios';
    if (ios) {
      return (
        <>
          <Path
            d={`M ${options.x11},${options.y11} L ${options.x12},${options.y12}`}
            stroke="url(#top)"
            strokeWidth={shadowWidth}
          />
          <Path
            d={`M ${options.x21},${options.y21} L ${options.x22},${options.y22}`}
            stroke="url(#right)"
            strokeWidth={shadowWidth}
          />
          <Path
            d={`M ${options.x31},${options.y31} L ${options.x32},${options.y32}`}
            stroke="url(#bottom)"
            strokeWidth={shadowWidth}
          />
          <Path
            d={`M ${options.x41},${options.y41} L ${options.x42},${options.y42}`}
            stroke="url(#left)"
            // stroke="red"
            strokeWidth={shadowWidth}
          />
        </>
      );
    } else {
      return (
        <>
          <Rect
            x={options.x11}
            y={options.y11}
            width={options.xAxisLength}
            height={shadowWidth}
            fill={'url(#top)'}
          />
          <Rect
            x={options.x21 - shadowWidth}
            y={options.y21}
            width={shadowWidth}
            height={options.yAxisLength}
            fill={'url(#right)'}
          />
          <Rect
            x={options.x31}
            y={options.y31 - shadowWidth}
            width={options.xAxisLength}
            height={shadowWidth}
            fill={'url(#bottom)'}
          />
          <Rect
            x={options.x41}
            y={options.y41}
            width={shadowWidth}
            height={options.yAxisLength}
            fill={'url(#left)'}
          />
        </>
      );
    }
  };

  return (
    <Svg
      height={viewport.height + 2 * shadowWidth}
      width={viewport.width + 2 * shadowWidth}
    >
      <Defs>
        <LinearGradient id="top" x1="1" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0" />
          <Stop offset="1" stopColor={color} stopOpacity={stopOpacity} />
        </LinearGradient>
        <LinearGradient id="right" x1="1" y1="0" x2="0" y2="0">
          <Stop offset="0" stopColor={color} stopOpacity="0" />
          <Stop offset="1" stopColor={color} stopOpacity={stopOpacity} />
        </LinearGradient>
        <LinearGradient id="bottom" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor={color} stopOpacity="0" />
          <Stop offset="1" stopColor={color} stopOpacity={stopOpacity} />
        </LinearGradient>
        <LinearGradient id="left" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={color} stopOpacity="0" />
          <Stop offset="1" stopColor={color} stopOpacity={stopOpacity} />
        </LinearGradient>

        <RadialGradient
          id="top-left"
          r="100%"
          cx="100%"
          cy="100%"
          fx="100%"
          fy="100%"
        >
          <Stop offset="0" stopColor={color} stopOpacity="1" />
          <Stop
            offset={`${borderRadius / (borderRadius + shadowWidth)}`}
            stopColor={color}
            stopOpacity={stopOpacity}
          />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient
          id="top-right"
          r="100%"
          cx="0"
          cy="100%"
          fx="0"
          fy="100%"
        >
          <Stop offset="0" stopColor={color} stopOpacity="1" />
          <Stop
            offset={`${borderRadius / (borderRadius + shadowWidth)}`}
            stopColor={color}
            stopOpacity={stopOpacity}
          />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="bottom-right" r="100%" cx="0" cy="0" fx="0" fy="0">
          <Stop offset="0" stopColor={color} stopOpacity={stopOpacity} />
          <Stop
            offset={`${borderRadius / (borderRadius + shadowWidth)}`}
            stopColor={color}
            stopOpacity={stopOpacity}
          />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient
          id="bottom-left"
          r="100%"
          cx="100%"
          cy="0"
          fx="100%"
          fy="0"
        >
          <Stop offset="0" stopColor={color} stopOpacity="1" />
          <Stop
            offset={`${borderRadius / (borderRadius + shadowWidth)}`}
            stopColor={color}
            stopOpacity={stopOpacity}
          />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      {renderBorder()}
      <Path
        d={`M ${options.x41},${options.y41} A ${options.circleR} ${options.circleR} 0 0 1 ${options.x11},${options.y11}`}
        stroke="url(#top-left)"
        strokeWidth={shadowWidth}
      />
      <Path
        d={`M ${options.x12},${options.y12} A ${options.circleR} ${options.circleR} 0 0 1 ${options.x21},${options.y21}`}
        stroke="url(#top-right)"
        strokeWidth={shadowWidth}
      />
      <Path
        d={`M ${options.x42},${options.y42} A ${options.circleR} ${options.circleR} 0 0 0 ${options.x31},${options.y31}`}
        stroke="url(#bottom-left)"
        strokeWidth={shadowWidth}
      />
      <Path
        d={`M ${options.x32},${options.y32} A ${options.circleR} ${options.circleR} 0 0 0 ${options.x22},${options.y22}`}
        stroke="url(#bottom-right)"
        strokeWidth={shadowWidth}
      />
      <View
        onLayout={handleLayout}
        style={[
          styles.content,
          {
            transform: [
              {
                translateX: shadowWidth,
              },
              {
                translateY: shadowWidth,
              },
            ],
          },
        ]}
      >
        {children}
      </View>
    </Svg>
  );
};

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
  },
});

export default Shadow;
