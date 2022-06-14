import React from 'react';
import {OverlayRef} from './Overlay';

/**
 * Must set at top <Overlay ref={overlayRef}>
 * OverlayUtil is just another way to invoke useOverlay
 * Can be used at out of FunctionComponent
 */
export const overlayRef = React.createRef<OverlayRef>();

export const OverlayUtil = {
  add: (children: React.ReactNode, key?: string) => overlayRef.current?.add(children, key),
  remove: () => overlayRef.current?.remove(),
  removeAll: () => overlayRef.current?.removeAll(),
};
