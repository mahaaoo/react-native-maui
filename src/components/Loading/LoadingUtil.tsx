import {overlayRef} from '../Overlay'
import Loading from './Loading'
import {OpacityContainer} from '../Overlay';

export const LoadingUtil = {
  style: () => {
    return (
      <OpacityContainer>
        <Loading />
      </OpacityContainer>
    )
  },
  show: () => {
    overlayRef.current?.add(LoadingUtil.style(), 'global-loading');
  },
  hide: () => overlayRef.current?.remove('global-loading'),
};
