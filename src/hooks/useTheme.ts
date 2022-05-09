import React from "react";
import {ThemeContext} from '../components/Theme';

export default function useTheme() {
  return React.useContext(ThemeContext);
}
