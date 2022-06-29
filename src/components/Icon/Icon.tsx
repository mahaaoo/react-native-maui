import React from 'react';
import Svg, { Path } from 'react-native-svg';
import {Library} from './library';

interface IconProps {
  name: keyof typeof Library;
  size?: number;
  color?: string;
};

const Icon: React.FC<IconProps> = props => {
  const {name, size = 20, color = 'black'} = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      <Path
        d={Library[name]}
        fill={color}
      />
    </Svg>
  )
};

export default Icon;
