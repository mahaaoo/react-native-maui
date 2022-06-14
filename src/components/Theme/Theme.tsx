import React, {useState} from 'react';
import defaultTheme from './default';
import darkTheme from './dark';

const themes = {
  default: defaultTheme,
  dark: darkTheme,
}

export enum ThemeType {
  Default = 'default',
  Dark = 'dark',
}

export const ThemeContext = React.createContext({
  theme: defaultTheme,
  themeName: ThemeType.Default,
  changeTheme: (themeName: ThemeType) => {},
});

export const useTheme = () => React.useContext(ThemeContext);

interface ThemeProps {

}

const Theme: React.FC<ThemeProps> = props => {
  const {children} = props;
  const [theme, changeTheme] = useState<ThemeType>(ThemeType.Default);

  return (
    <ThemeContext.Provider
      value={{ theme: themes[theme], themeName: theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default Theme;
