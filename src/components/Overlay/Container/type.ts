import { ViewStyle } from 'react-native';

/**
 * All Overlay Container Must exntent this interface
 */
export interface BaseContainerProps {
  /**
   * overlay show componet
   */
  children: React.ReactNode;
  /**
   * this innerKey equals overlay.tsx's key, it ensure the overlay can remove itself
   */
  readonly innerKey?: string;
  /**
   * containerStyle is the closest to children, you can set flex to control children's position
   */
  containerStyle?: ViewStyle;

  /**
   * will be called after the overlay mount
   */
  onAppear?: () => void;
  /**
   * will be called after the overlay unmount
   */
  onDisappear?: () => void;
  /**
   * 'none': overlay can't response event, can click view under overlay
   * 'auto': overlay response evet
   */
  pointerEvents?: 'none' | 'auto';
}

/**
 * Animation Overlay Container All has below props
 */
export interface AnimationContainerProps extends BaseContainerProps {
  /**
   * need mask to cover rest of window
   */
  mask?: boolean;
  /**
   * animation duration time
   * ms
   */
  duration?: number;
  /**
   * If modal equal true, the overlay must be remove by call remove function
   * If modal equal false, the overlay can be close by click mask
   */
  modal?: boolean;
  /**
   * will be called after click mask
   */
  onClickMask?: () => void;
}
