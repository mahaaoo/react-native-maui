import React from 'react';
import { View } from 'react-native';

interface SeparatorProps {
  spacing: number;
  children?: React.ReactNode;
}

const Separator: React.FC<SeparatorProps> = (props) => {
  const { spacing, children = <></> } = props;

  return (
    <View
      style={{
        height: '100%',
        width: spacing,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  );
};

export default Separator;
