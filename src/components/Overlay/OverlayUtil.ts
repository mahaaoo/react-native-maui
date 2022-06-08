import React from 'react';
import {OverlayRef} from './Overlay';

export const overlayRef = React.createRef<OverlayRef>();

export const OverlayUtil = {
  add: (children: React.ReactNode, key?: string) => overlayRef.current?.add(children, key),
  remove: () => overlayRef.current?.remove(),
  removeAll: () => overlayRef.current?.removeAll(),
};
