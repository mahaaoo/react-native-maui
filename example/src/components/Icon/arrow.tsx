import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ArrowProps {
};

const Arrow: React.FC<ArrowProps> = props => {
  const {} = props;

  return (
    <Svg width={20} height={20} viewBox="0 0 1024 1024">
      <Path
        d={"M593.450667 512.128L360.064 278.613333l45.290667-45.226666 278.613333 278.762666L405.333333 790.613333l-45.226666-45.269333z"}
        fill={'black'}
      />
    </Svg>
  )
};

export default Arrow;
