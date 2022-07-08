import React, { useContext } from 'react';

export const CollapseContext = React.createContext<CollapseContextProps>(
  {} as CollapseContextProps
);
export const useCollapse = () => useContext(CollapseContext);

export interface CollapseContextProps {
  accordion: boolean;
  currentActive?: string;
  handleOnChange: (tag: string) => void;
}
