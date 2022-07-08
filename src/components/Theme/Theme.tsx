import React, { useState } from 'react';
import defaultTheme from './default';
import darkTheme from './dark';
import { ThemeColorType } from './type';

const themes: any = {
  default: defaultTheme,
  dark: darkTheme,
};

export enum ThemeType {
  Default = 'default',
  Dark = 'dark',
}

export interface ThemeContextProps {
  theme: ThemeColorType;
  themeName: ThemeType;
  changeTheme: (themeName: ThemeType) => void;
}

export const ThemeContext = React.createContext({} as ThemeContextProps);

export const useTheme = () => React.useContext(ThemeContext);

interface ThemeProps {}

const Theme: React.FC<ThemeProps> = (props) => {
  const { children } = props;
  const [theme, changeTheme] = useState<ThemeType>(ThemeType.Default);

  const handleChangetheme = (theme: ThemeType) => {
    changeTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[theme],
        themeName: theme,
        changeTheme: handleChangetheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default Theme;
