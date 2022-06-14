import {overlayRef} from '../Overlay'
import {TranslateContainer} from '../Overlay';
import React from 'react';
import { ActionSheetProps } from './ActionSheet';

export const ActionSheetUtil = {
  key: 'global-action-sheet',
  show: (actionSheet: React.ReactElement<ActionSheetProps>) => {
    const onDisappear = actionSheet?.props?.onDisappear;
    const component = (
      <TranslateContainer onDisappear={onDisappear}>
        {actionSheet}
      </TranslateContainer>
    );

    overlayRef.current?.add(component, ActionSheetUtil.key);
  },
  hide: () => overlayRef.current?.remove(ActionSheetUtil.key),
  isExist: () => overlayRef.current?.isExist(ActionSheetUtil.key)
};
