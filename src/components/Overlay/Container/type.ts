export interface BaseContainerProps {
  children: React.ReactNode,
  readonly innerKey?: string,
  onAppear?: () => void;
  onDisappear?: () => void;
}

export interface AnimationContainerProps extends BaseContainerProps {
  mask?: boolean
  duration?: number;
  modal?: boolean;
  pointerEvents?: 'none' | 'auto';

  onClickMask?: () => void;
}