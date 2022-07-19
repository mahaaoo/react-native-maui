import React, { useCallback, useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import { useOverlay } from '../Overlay';
import PopoverContainer from './PopoverContainer';
import { Placement, ArrowPlacement } from './type';

interface PopoverProps {
  modal: boolean;
  content: React.ReactNode;

  style?: ViewStyle;
  arrowPosition?: ArrowPlacement;
  placement?: Placement;
  arrowSize?: number;
  arrowColor?: string;

  onPressMask?: () => void;
}

const Popover: React.FC<PopoverProps> = (props) => {
  const {
    children,
    modal,
    content,
    style,
    onPressMask,
    arrowPosition = 'center',
    placement = 'top',
    arrowSize = 10,
    arrowColor = 'white',
  } = props;
  const aref = useRef<View | null>(null);
  const { add, remove } = useOverlay();

  useEffect(() => {
    if (modal) {
      show();
    } else {
      remove('popover');
    }
  }, [modal]);

  const show = useCallback(() => {
    aref?.current?.measure((x, y, width, height, pageX, pageY) => {
      console.log({
        x,
        y,
        width,
        height,
        pageX,
        pageY,
      });

      add(
        <PopoverContainer
          {...{ arrowPosition, placement, arrowSize, arrowColor }}
          position={{
            x,
            y,
            width,
            height,
            pageX,
            pageY,
          }}
          onPressMask={onPressMask}
        >
          {content}
        </PopoverContainer>,
        'popover'
      );
    });
  }, [arrowPosition, placement]);

  return (
    <View style={style} ref={(ref) => (aref.current = ref)}>
      {children}
    </View>
  );
};

export default Popover;
