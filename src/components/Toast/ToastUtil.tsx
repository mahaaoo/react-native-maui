import {overlayRef} from '../Overlay'
import Toast from './Toast'
import {TranslateContainer, OpacityContainer} from '../Overlay';

export interface ToastOptions {
  duration?: number;
  animation?: 'translate' | 'opacity';
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

export const ToastUtil = {
  key: 'global-toast',
  template: (title: string, options?: ToastOptions) => {
    // return (
    //   <OpacityContainer mask={false} pointerEvents="none">
    //     <Toast title={title} style={{ marginBottom: 50 }} />
    //   </OpacityContainer>
    // )

    return (
      <TranslateContainer mask={false} pointerEvents="none" containerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
        <Toast title={title} style={{ marginBottom: 50 }} />
      </TranslateContainer>
    )
  },
  show: (title:string, options?: ToastOptions) => {
    const duration = options?.duration || 2000;
    if (!ToastUtil.isExist()) {
      const time = setTimeout(() => {
        ToastUtil.hide();
        clearTimeout(time);
      }, duration);  
    }
    overlayRef.current?.add(ToastUtil.template(title, options), ToastUtil.key);
  },
  hide: () => overlayRef.current?.remove(ToastUtil.key),
  isExist: () => overlayRef.current?.isExist(ToastUtil.key),
};
