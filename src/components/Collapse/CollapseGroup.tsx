import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { CollapseContext } from './type';

interface CollapseGroupProps {
  defaultActive?: string;
  accordion?: boolean;
}

const CollapseGroup: React.FC<CollapseGroupProps> = (props) => {
  const { children, accordion = false, defaultActive } = props;
  const [currentActive, setActive] = useState(defaultActive);

  const handleOnChange = useCallback((tag: string) => {
    setActive(tag);
  }, []);

  return (
    <CollapseContext.Provider
      value={{
        accordion,
        currentActive,
        handleOnChange,
      }}
    >
      <View>{children}</View>
    </CollapseContext.Provider>
  );
};

export default CollapseGroup;
