import React from 'react';
import {Dimensions, View, StyleSheet} from 'react-native';
import Svg, { Defs, Pattern, Rect, Text } from 'react-native-svg';

const {width, height} = Dimensions.get('window');

interface WaterMarkExampleProps {
};

const WaterMarkExample: React.FC<WaterMarkExampleProps> = props => {
  const {} = props;

  return (
    <View style={{ ...StyleSheet.absoluteFillObject }}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id="TriangleWaterMark"
            patternUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="150"
            height="150"
          >
            <Text
              rotation="-50" origin="100, 50"
              fill="none"
              stroke="#D8D8D8"
              fontSize="24"
              fontWeight="bold"
              opacity="0.5"
              x="0"
              y="20"
              textAnchor="start"
            >
              maui
            </Text>
          </Pattern>
        </Defs>
        <Rect 
          fill="url(#TriangleWaterMark)" x="0" y="0" width={width} height={height} />
      </Svg>
    </View>
  )
};

export default WaterMarkExample;
