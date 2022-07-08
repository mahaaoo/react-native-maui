import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface PlusProps {}

const Plus: React.FC<PlusProps> = (props) => {
  const {} = props;

  return (
    <Svg width={20} height={20}>
      <Rect x={9} y={0} width={2} height={20} fill={'white'} />
      <Rect x={0} y={9} width={20} height={2} fill={'white'} />
    </Svg>
  );
};

export default Plus;
