import { Easing, useSharedValue } from 'react-native-reanimated';
import { PickerProps, PickerDefaultProps, PickDefaultOptions } from './type';

const useProps = (props: PickerProps): PickerDefaultProps => {
  const {options} = props;

  const defaultOptions = {
    itemHeight: 0,
    maxRender: 0,
  };

  defaultOptions.itemHeight = options?.itemHeight || 30;
  defaultOptions.maxRender = options?.maxRender || 2;

  return {...props, options: defaultOptions};
}

const useInitialValue = (options: PickDefaultOptions, dataSource: any[]) => {
  const defaultY = options.itemHeight*options.maxRender;
  const translateY = useSharedValue(defaultY); 
  const offset = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  const snapPoints = dataSource.map((_, index) => -index * options.itemHeight + defaultY);  

  const timingOptions = {
    duration: 1000,
    easing: Easing.bezier(0.22, 1, 0.36, 1),  
  }

  return {
    translateY,
    offset,
    currentIndex,
    snapPoints,
    timingOptions
  }
}

export {
  useProps,
  useInitialValue
}
