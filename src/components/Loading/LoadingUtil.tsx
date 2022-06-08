import {overlayRef} from '../Overlay'
import Loading from './Loading'
import {OverlayContainer} from '../Overlay';

export const LoadingUtil = {
  style: () => {
    return (
      <OverlayContainer>
        <Loading />
      </OverlayContainer>
    )
  },
  show: () => {
    overlayRef.current?.add(LoadingUtil.style(), 'global-loading')
  },
  hide: () => overlayRef.current?.remove('global-loading'),
};
