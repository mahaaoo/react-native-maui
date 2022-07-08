import { useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { ButtonType } from './type';

export const useType = (type: ButtonType): ViewStyle => {
  const style: ViewStyle = useMemo(() => {
    switch (true) {
      case type === ButtonType.Primary:
        return {
          padding: 15,
          borderRadius: 3,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#2593FC',
        };
      case type === ButtonType.Default:
        return {
          padding: 15,
          borderRadius: 3,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderColor: '#D9D9D9',
          borderWidth: 1,
        };
      case type === ButtonType.Link:
        return {
          padding: 15,
          justifyContent: 'center',
          alignItems: 'center',
        };
      case type === ButtonType.Disabled:
        return {
          padding: 15,
          borderRadius: 3,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F5F5F5',
          borderColor: '#D9D9D9',
          borderWidth: 1,
        };
      default:
        return {};
    }
  }, [type]);

  return style;
};
