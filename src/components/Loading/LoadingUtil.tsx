import {overlayRef} from '../Overlay'
import Loading from './Loading'
import {OpacityContainer} from '../Overlay';

export const LoadingUtil = {
  key: 'global-loading',
  template: () => {
    return (
      <OpacityContainer containerStyle={{ justifyContent: 'center', alignItems: 'center'}}>
        <Loading />
      </OpacityContainer>
    )
  },
  show: () => {
    overlayRef.current?.add(LoadingUtil.template(), LoadingUtil.key);
  },
  hide: () => overlayRef.current?.remove(LoadingUtil.key),
  isExist: () => overlayRef.current?.isExist(LoadingUtil.key)
};
