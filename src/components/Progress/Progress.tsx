import React, { useMemo } from 'react';
import {View, ViewStyle} from 'react-native';

interface ProgressProps {
  activeColor?: string;
  inactiveColor?: string;
  value: number;
  style: ViewStyle;
};

const Progress: React.FC<ProgressProps> = props => {
  const {
    activeColor='#1e90ff',
    inactiveColor='#D8D8D8',
    value,
    style
  } = props;

  const borderRadius = useMemo(() => {
    return style?.borderRadius || 0;
  }, [style]);

  const progressStyle = useMemo(() => {
    let percent = value;
    if (percent <= 0) {
      percent = 0;
    } else if (percent >= 100) {
      percent = 100;
    }

    return {
      height: '100%',
      width: `${percent}%`,
      backgroundColor: activeColor,
      borderRadius
    }
  }, [value, activeColor, borderRadius]);
  
  return (
    <View style={[style, { backgroundColor: inactiveColor}]}>
      <View style={[progressStyle]} />
    </View>
  )
};

export default Progress;
