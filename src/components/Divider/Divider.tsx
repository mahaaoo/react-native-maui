import React from 'react';
import Svg, { Line } from 'react-native-svg';

export interface DividerProps {
  start: number;
  end: number;

  vertical?: boolean;
  color?: string;
  strokeDasharray?: string;
  width?: number;
}

const Divider: React.FC<DividerProps> = (props) => {
  const {
    vertical,
    strokeDasharray,
    color = '#e4e4e4',
    start,
    end,
    width = 1,
  } = props;

  if (vertical) {
    return (
      <Svg testID="MAUI-DIVIDER-ID" height={'100%'} width={width}>
        <Line
          x1="0"
          y1={start}
          x2="0"
          y2={end}
          stroke={color}
          strokeWidth={width}
          strokeDasharray={strokeDasharray}
        />
      </Svg>
    );
  }

  return (
    <Svg testID="MAUI-DIVIDER-ID" height={width} width={'100%'}>
      <Line
        x1={start}
        y1="0"
        x2={end}
        y2="0"
        stroke={color}
        strokeDasharray={strokeDasharray}
        strokeWidth={width}
      />
    </Svg>
  );
};

export default Divider;
